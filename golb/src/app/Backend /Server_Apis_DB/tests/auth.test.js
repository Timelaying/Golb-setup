const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const { newDb } = require("pg-mem");
const pgp = require("pg-promise")();

const authRoutes = require("../routes/auth.routes");
const { setDb } = require("../models/users.model");

const app = express();
app.use(express.json());
app.use("/api", authRoutes);

describe("🔐 Auth Routes", () => {
  let mockDb;

  beforeEach(async () => {
    const pgMem = newDb();
    mockDb = pgMem.adapters.createPgPromise();
    setDb(mockDb); // 🔁 Inject the mock DB into model layer

    // Create users table
    await mockDb.none(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        location TEXT,
        bio TEXT,
        profile_picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        refresh_token TEXT
      )
    `);

    // Insert test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    await mockDb.none(
      `INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)`,
      ["Test User", "testuser", "test@example.com", hashedPassword]
    );
  });

  test("✅ /api/test returns working message", async () => {
    const res = await request(app).get("/api/test");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("✅ Auth route working");
  });

  test("✅ /api/login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.message).toMatch(/login successful/i);
  });

  test("❌ /api/login with wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  test("❌ /api/login with unknown user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "ghost", password: "password123" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/user not found/i);
  });
});
