// startServer.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const config = require("./config");

function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());

  // Static files for profile pictures, post images, etc.
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Mount routes (to be imported and grouped later)
  // Example:
  // const userRoutes = require("./routes/user.routes");
  // app.use("/api/users", userRoutes);

  return app;
}

function startServer(port = config.PORT) {
  const app = createServer();

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}

module.exports = { createServer, startServer };
