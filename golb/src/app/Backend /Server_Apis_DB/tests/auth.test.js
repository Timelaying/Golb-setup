const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { newDb } = require("pg-mem");

// Declare mockDb at the top (but don't initialize yet)
let mockDb;

// ✅ Mock db.js
jest.mock("../db", () => {
  return {
    query: (...args) => mockDb.query(...args),
  };
});

// ✅ Mock users.model.js
jest.mock("../models/users.model", () => ({
    findUserByUsername: async (username) => {
      const result = await mockDb.query(`SELECT * FROM users WHERE username = '${username}'`);
      return result[0] || null;
    },
    findUserById: async (id) => {
      const result = await mockDb.query(`SELECT * FROM users WHERE id = ${id}`);
      return result[0] || null;
    },
  }));
  

// Load app AFTER mocks
const authRoutes = require("../routes/auth.routes");
const app = express();
app.use(express.json());
app.use("/api", authRoutes);

beforeAll(async () => {
  const dbInstance = newDb();
  mockDb = dbInstance.public;

  // Create tables
  mockDb.none(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      refresh_token TEXT
    );
  `);

  // Seed user
  const hashedPassword = await bcrypt.hash("password123", 10);
  await mockDb.none(`
    INSERT INTO users (name, username, email, password)
    VALUES ('Test User', 'testuser', 'test@example.com', '${hashedPassword}');
  `);
  
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
  });

  test("❌ /api/login with wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials.");
  });

  test("❌ /api/login with unknown user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "ghost", password: "password123" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });
});
