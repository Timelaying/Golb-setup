// controllers/bookmarks.controller.js
const {
    addBookmark,
    removeBookmark,
    getBookmarks,
  } = require("../models/bookmarks.model");
  
  const errorCodes = require("../utils/errorCodes");
  
  exports.createBookmark = async (req, res) => {
    const { userId, postId } = req.body;
    if (!userId || !postId) {
      return res.status(400).json(errorCodes.MISSING_FIELDS);
    }
  
    const bookmark = await addBookmark(userId, postId);
    res.status(201).json(bookmark);
  };
  
  exports.deleteBookmark = async (req, res) => {
    const { userId, postId } = req.body;
    if (!userId || !postId) {
      return res.status(400).json(errorCodes.MISSING_FIELDS);
    }
  
    const removed = await removeBookmark(userId, postId);
    res.status(200).json(removed);
  };
  
  exports.fetchBookmarks = async (req, res) => {
    const { userId } = req.params;
    const bookmarks = await getBookmarks(userId);
    res.status(200).json(bookmarks);
  };
  