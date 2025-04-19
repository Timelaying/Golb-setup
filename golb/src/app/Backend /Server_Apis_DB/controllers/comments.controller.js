// controllers/comments.controller.js
const pool = require("../db");
const {
  addComment,
  getNestedComments,
  updateComment,
  deleteComment,
} = require("../models/comments.model");
const errorCodes = require("../utils/errorCodes");

exports.createComment = async (req, res) => {
  const { userId, postId, content, parentCommentId = null } = req.body;
  if (!userId || !postId || !content) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const comment = await addComment(userId, postId, content, parentCommentId);
  res.status(201).json(comment);
};

exports.editComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const updated = await updateComment(commentId, userId, content);
  if (!updated) {
    return res.status(403).json(errorCodes.UNAUTHORIZED_COMMENT_EDIT);
  }

  res.status(200).json({ message: "Comment updated", comment: updated });
};

exports.removeComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  const deleted = await deleteComment(commentId, userId);
  if (!deleted) {
    return res.status(404).json(errorCodes.COMMENT_NOT_FOUND);
  }

  res.status(200).json({ message: "Comment deleted successfully." });
};

exports.fetchComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await getNestedComments(postId);
  res.status(200).json(comments);
};

exports.replyToComment = async (req, res) => {
  const { userId, postId, content, parentCommentId } = req.body;
  if (!userId || !postId || !content || !parentCommentId) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const query = `
    INSERT INTO comments (user_id, post_id, content, parent_comment_id) 
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const result = await pool.query(query, [userId, postId, content, parentCommentId]);
  res.status(201).json(result.rows[0]);
};
