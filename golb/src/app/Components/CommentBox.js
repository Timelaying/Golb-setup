import { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false); 
  const [replyingTo, setReplyingTo] = useState(null); // ✅ Track reply target
  const [replyText, setReplyText] = useState(""); // ✅ Store reply input text

  // ✅ Fetch comments when toggled
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (showComments) fetchComments();
  }, [showComments, postId]);

  // ✅ Handle adding a new comment (or reply)
  const handleAddComment = async (parentCommentId = null) => {
    const content = parentCommentId ? replyText : newComment;
    if (!content.trim()) return;
    
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/comment", {
        userId,
        postId,
        content,
        parentCommentId,
      });

      // Update UI
      if (parentCommentId) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentCommentId
              ? { ...comment, replies: [res.data, ...(comment.replies || [])] }
              : comment
          )
        );
        setReplyingTo(null);
        setReplyText("");
      } else {
        setComments([res.data, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }

    setLoading(false);
  };

  // ✅ Render nested comments
  const renderComments = (commentsList) => {
    return commentsList.map((comment) => (
      <div key={comment.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2">
        <p className="font-semibold text-gray-300">{comment.username || "User"}</p>
        <p className="text-gray-400">{comment.content}</p>

        {/* ✅ Reply Button */}
        <button
          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          className="text-blue-400 text-sm mt-1"
        >
          {replyingTo === comment.id ? "Cancel" : "Reply"}
        </button>

        {/* ✅ Reply Input Field */}
        {replyingTo === comment.id && (
          <div className="ml-4 mt-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleAddComment(comment.id)}
              disabled={loading}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
            >
              {loading ? "Posting..." : "Reply"}
            </button>
          </div>
        )}

        {/* ✅ Render Replies Recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-6 mt-2">{renderComments(comment.replies)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      {/* ✅ Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-blue-500 underline"
      >
        {showComments ? "Hide Comments" : "View Comments"}
      </button>

      {showComments && (
        <>
          <h3 className="font-semibold text-lg text-gray-200 mt-2">Comments</h3>

          {/* ✅ Comment Input */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleAddComment(null)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* ✅ Comments List (Nested) */}
          <div className="mt-4">
            {comments.length > 0 ? renderComments(comments) : <p className="text-gray-500">No comments yet.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentSection;
