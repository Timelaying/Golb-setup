const pool = require("../db");

async function addComment(userId, postId, content, parentCommentId = null) {
  const res = await pool.query(
    `INSERT INTO comments (user_id, post_id, content, parent_comment_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, postId, content, parentCommentId]
  );
  return res.rows[0];
}

async function getCommentsForPost(postId) {
  const res = await pool.query(
    `SELECT comments.*, users.username 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE comments.post_id = $1 
     ORDER BY comments.created_at ASC`,
    [postId]
  );
  return res.rows;
}

async function updateComment(commentId, userId, content) {
  const result = await pool.query(
    `UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
    [content, commentId, userId]
  );
  return result.rows[0];
}

async function deleteComment(commentId, userId) {
  const result = await pool.query(
    `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
    [commentId, userId]
  );
  return result.rows[0];
}

module.exports = {
  addComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
};
