// comment.test.js

process.env.ACCESS_TOKEN_SECRET = "test_access_secret";
process.env.REFRESH_TOKEN_SECRET = "test_refresh_secret";

jest.setTimeout(15000);

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const { newDb } = require("pg-mem");
const bcrypt = require("bcrypt");

const commentRoutes = require("../routes/comment.routes");
const { setDb: setUserDb } = require("../models/users.model");
const { setDb: setCommentDb } = require("../models/comments.model");

let app, db;
let userId, postId, commentId;

beforeEach(async () => {
  const pgMem = newDb();
  db = pgMem.adapters.createPgPromise();

  // Inject db into models
  setUserDb(db);
  setCommentDb(db);

  // Create users and comments related tables
  await db.none(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      refresh_token TEXT
    );

    CREATE TABLE posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      user_id INT REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      post_id INT REFERENCES posts(id),
      content TEXT NOT NULL,
      parent_comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create test user
  const hashed = await bcrypt.hash("pass", 10);
  const user = await db.one(
    `INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *`,
    ["Tim", "tim", "tim@example.com", hashed]
  );
  userId = user.id;

  // Create test post
  const post = await db.one(
    `INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *`,
    ["Hello", "World", userId]
  );
  postId = post.id;

  // Setup app
  app = express();
  app.use(bodyParser.json());
  app.use("/api", commentRoutes);
});

describe("💬 Comment Routes", () => {
  test("✅ Add a comment", async () => {
    const res = await request(app).post("/api/comment").send({
      userId,
      postId,
      content: "First comment"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.content).toBe("First comment");
    commentId = res.body.id;
  });

  test("✅ Reply to a comment", async () => {
    // Create a base comment
    const base = await db.one(
      `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [userId, postId, "Base comment"]
    );

    const res = await request(app).post("/api/reply").send({
      userId,
      postId,
      content: "Reply comment",
      parentCommentId: base.id
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe("Reply comment");
    expect(res.body.parent_comment_id).toBe(base.id);
  });

  test("✅ Edit a comment", async () => {
    // Add a comment to edit
    const comment = await db.one(
      `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [userId, postId, "Old content"]
    );

    const res = await request(app).put(`/api/comment/${comment.id}`).send({
      userId,
      content: "Updated content"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment.content).toBe("Updated content");
  });

  test("✅ Delete a comment", async () => {
    // Add a comment to delete
    const comment = await db.one(
      `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [userId, postId, "To delete"]
    );

    const res = await request(app).delete(`/api/comment/${comment.id}`).send({
      userId
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  test("✅ Fetch nested comments", async () => {
    // Base comment
    const base = await db.one(
      `INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *`,
      [userId, postId, "Top-level"]
    );

    // Reply
    await db.none(
      `INSERT INTO comments (user_id, post_id, content, parent_comment_id) VALUES ($1, $2, $3, $4)`,
      [userId, postId, "Nested reply", base.id]
    );

    const res = await request(app).get(`/api/comments/${postId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].replies.length).toBe(1);
    expect(res.body[0].replies[0].content).toBe("Nested reply");
  });
});
