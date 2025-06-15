process.env.ACCESS_TOKEN_SECRET = "test_access_secret";
process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret";

jest.setTimeout(15000); // ⏱️ increase test timeout globally

const request = require("supertest");
const express = require("express");
const { newDb } = require("pg-mem");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const authRoutes = require("../routes/auth.routes");
const { setDb } = require("../models/users.model");

let app, db;

beforeEach(async () => {
  const pgMem = newDb();
  db = pgMem.adapters.createPgPromise();
  setDb(db); // ✅ Only one injection, no warning

  // Reset the DB
  await db.none("DROP TABLE IF EXISTS users");

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

  const hashedPassword = await bcrypt.hash("password123", 10);
  await db.none(
    `INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)`,
    ["Test User", "testuser", "test@example.com", hashedPassword]
  );

  app = express();
  app.use(bodyParser.json());
  app.use("/api", authRoutes);
});

describe("🔐 Auth Routes", () => {
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
    expect(res.body.message).toBe("Login successful!");
  });

  test("❌ /api/login with wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials.");
  });

  test("❌ /api/login with unknown user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "ghost", password: "password123" });

    expect(res.statusCode).toBe(404);
    expect(res.body.code).toBe("USER_NOT_FOUND");
  });
});
