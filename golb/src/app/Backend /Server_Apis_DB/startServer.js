// startServer.js
const http = require("http");

/**
 * Starts the Express server.
 * 
 * @param {Express.Application} app - The Express app instance.
 * @param {number} port - The port to listen on.
 * @param {Function} [callback] - Optional callback after server starts.
 */
function startServer(app, port, callback) {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
    if (callback) callback();
  });

  // Optional: Handle graceful shutdowns
  process.on("SIGINT", () => {
    console.log("\n🛑 Gracefully shutting down...");
    server.close(() => {
      console.log("✅ Server closed.");
      process.exit(0);
    });
  });

  return server;
}

module.exports = startServer;
