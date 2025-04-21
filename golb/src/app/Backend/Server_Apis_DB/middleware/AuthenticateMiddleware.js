//middleware/AuthenticateMiddleware.js

const jwt = require("jsonwebtoken");

// Middleware to verify the access token
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }

    try {
        // Verify the access token using ACCESS_TOKEN_SECRET
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = authenticateToken;
