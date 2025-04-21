// routes/search.routes.js
const express = require("express");
const router = express.Router();
const { searchUsers } = require("../controllers/search.controller");

router.get("/search", searchUsers);

module.exports = router;
