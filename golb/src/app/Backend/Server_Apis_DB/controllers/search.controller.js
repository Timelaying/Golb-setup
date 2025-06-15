// controllers/search.controller.js
const { searchUsersByUsername } = require("../models/users.model");
const errorCodes = require("../utils/errorCodes");

exports.searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const users = await searchUsersByUsername(query);
  res.status(200).json(users);
};
