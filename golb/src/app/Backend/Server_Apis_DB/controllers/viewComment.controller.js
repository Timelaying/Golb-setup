// controllers/viewComment.controller.js
const { getCommentsForPost, addComment } = require("../models/comments.model");
const errorCodes = require("../utils/errorCodes");

// 🌳 Organize flat list into nested replies
function buildCommentTree(flatComments) {
  const commentMap = {};
  const rootComments = [];

  flatComments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment.id] = comment;

    if (comment.parent_comment_id) {
      commentMap[comment.parent_comment_id]?.replies.push(comment);
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}

// ✅ Controller: Fetch nested comments
exports.handleFetchComments = async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const flatComments = await getCommentsForPost(postId);
  const nested = buildCommentTree(flatComments);

  res.status(200).json({
    message: "Comments fetched successfully!",
    comments: nested,
  });
};

// ✅ Controller: Add comment or reply
exports.handleAddComment = async (req, res) => {
  const { postId, content, parentCommentId } = req.body;
  const userId = req.user.id;

  if (!userId || !postId || !content) {
    return res.status(400).json(errorCodes.MISSING_FIELDS);
  }

  const newComment = await addComment(userId, postId, content, parentCommentId || null);

  res.status(200).json({
    message: "Comment added successfully!",
    comment: newComment,
  });
};
