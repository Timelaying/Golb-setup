const express = require("express");
const router = express.Router();
const {
  createBookmark,
  deleteBookmark,
  fetchBookmarks
} = require("../controllers/bookmarks.controller");

// POST /bookmark
router.post("/bookmark", createBookmark);

// DELETE /bookmark
router.delete("/bookmark", deleteBookmark);

// GET /bookmarks/:userId
router.get("/bookmarks/:userId", fetchBookmarks);

module.exports = router;
