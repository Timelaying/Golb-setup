// 🧠 config.js
require("dotenv").config();

const config = {
  port: Number(process.env.PORT) || 5000,
  db: {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT) || 5432,
  },
  baseUrl: process.env.BASE_URL || "http://localhost:5000",
  // For serving images and links
};

module.exports = config;
