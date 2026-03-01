// 🧠 config.js
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envCandidates = [
  path.resolve(__dirname, ".env"),
  path.resolve(process.cwd(), ".env"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

dotenv.config(envPath ? { path: envPath } : undefined);

const config = {
  port: process.env.PORT || 5000,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    url: process.env.DATABASE_URL,
  },
  baseUrl: process.env.BASE_URL || "http://localhost:5000",
  databaseUrl: process.env.DATABASE_URL,
  // For serving images and links
};

module.exports = config;
