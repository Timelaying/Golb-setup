// controllers/feed.controller.js
const { getFeedForUser } = require("../models/posts.model");
const errorCodes = require("../utils/errorCodes");

exports.fetchUserFeed = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  if (!userId || isNaN(userId)) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const feed = await getFeedForUser(userId, limit, offset);
  res.status(200).json(feed);
};
