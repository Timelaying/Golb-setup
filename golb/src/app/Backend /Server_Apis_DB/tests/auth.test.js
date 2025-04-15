const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const { newDb } = require("pg-mem");

describe("🔐 Auth Routes", () => {
  let app;
  let mockDb;

  beforeAll(async () => {
    const pgMem = newDb();
    mockDb = pgMem.public; // ✅ Use .public schema

    // Create schema
    await mockDb.none(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          refresh_token TEXT
        );
      `);
      
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      await mockDb.none(`
        INSERT INTO users (name, username, email, password)
        VALUES ('Test User', 'testuser', 'test@example.com', '${hashedPassword}')
      `);
      

    jest.resetModules();

    // Inject mockDb
    const usersModel = require("../models/users.model");
    usersModel.setDb(mockDb);

    const authRoutes = require("../routes/auth.routes");

    app = express();
    app.use(express.json());
    app.use("/api", authRoutes);
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
  });

  test("❌ /api/login with wrong password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
  });

  test("❌ /api/login with unknown user", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "ghost", password: "password123" });

    expect(res.statusCode).toBe(404);
  });
});
