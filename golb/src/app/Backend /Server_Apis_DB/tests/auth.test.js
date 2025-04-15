// tests/auth.test.js

const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const { newDb } = require("pg-mem");
const jwt = require("jsonwebtoken");

const authRoutes = require("../routes/auth.routes");
const { setDb } = require("../models/users.model");

const app = express();
app.use(express.json());
app.use("/api", authRoutes);

describe("🔐 Auth Routes", () => {
  let db;

  beforeAll(async () => {
    // Create in-memory pg-mem DB
    const pgMem = newDb();
    db = pgMem.adapters.createPgPromise();

    // Create users table
    await db.none(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        refresh_token TEXT
      );
    `);

    // Seed test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    await db.none(
      "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)",
      ["Test User", "testuser", "test@example.com", hashedPassword]
    );

    // Inject mock db
    setDb(db);
  });

  test("✅ /api/test returns working message", async () => {
    const res = await request(app).get("/api/test");
    expect(res.status).toBe(200);
    expect(res.text).toBe("✅ Auth route working");
  });

  test("✅ /api/login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  test("❌ /api/login with wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Invalid credentials/);
  });

  test("❌ /api/login with unknown user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "ghost", password: "password123" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });
});
