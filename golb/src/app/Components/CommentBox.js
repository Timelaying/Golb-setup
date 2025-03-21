import { useState, useEffect } from "react";
import axios from "axios";
import useCurrentUser from "../utils/useCurrentUser";

const CommentBox = ({ postId }) => {
  const currentUser = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [editText, setEditText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/comment", {
        userId: currentUser.id,
        postId,
        content: newComment,
      });

      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleReplySubmit = async (parentCommentId) => {
    const reply = replyText[parentCommentId];
    if (!reply || !currentUser) return;

    try {
      await axios.post("http://localhost:5000/api/reply", {
        userId: currentUser.id,
        postId,
        content: reply,
        parentCommentId,
      });

      setReplyText((prev) => ({ ...prev, [parentCommentId]: "" }));
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditText((prev) => ({ ...prev, [commentId]: content }));
  };

  const handleEditChange = (commentId, text) => {
    setEditText((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleSaveEdit = async (commentId) => {
    const newContent = editingContent[commentId];
    if (!newContent || !currentUser) return;
  
    try {
      const res = await axios.put(`http://localhost:5000/api/comment/${commentId}`, {
        userId: currentUser.id, // ✅ Add userId
        content: newContent,
      });
  
      fetchComments();
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/comment/${commentId}`);
      fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-blue-500 underline"
      >
        {showComments ? "Hide Comments" : "View Comments"}
      </button>

      {showComments && (
        <>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddComment}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          <div className="mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2"
                >
                  <p className="font-semibold text-gray-300">{comment.username}</p>

                  {editingCommentId === comment.id ? (
                    <>
                      <textarea
                        className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded"
                        value={editText[comment.id] || ""}
                        onChange={(e) => handleEditChange(comment.id, e.target.value)}
                      />
                      <div className="mt-1 flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-400">{comment.content}</p>

                      {currentUser?.id === comment.user_id && (
                        <div className="mt-1 flex space-x-2">
                          <button
                            onClick={() => handleEditClick(comment.id, comment.content)}
                            className="text-yellow-400 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* ✅ Reply input */}
                  <div className="mt-2 ml-4">
                    <input
                      type="text"
                      value={replyText[comment.id] || ""}
                      onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Reply
                    </button>
                  </div>

                  {/* ✅ Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-6 border-l border-gray-600 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="mb-2">
                          <p className="text-sm text-gray-300 font-medium">{reply.username}</p>
                          <p className="text-sm text-gray-400">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentBox;
