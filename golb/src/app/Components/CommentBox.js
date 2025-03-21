import { useState, useEffect } from "react";
import axios from "axios";
import useCurrentUser from "../utils/useCurrentUser";

const CommentBox = ({ postId }) => {
  const currentUser = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleReplySubmit = async (parentId) => {
    const reply = replyText[parentId];
    if (!reply || !currentUser) return;

    try {
      const res = await axios.post("http://localhost:5000/api/reply", {
        userId: currentUser.id,
        postId,
        content: reply,
        parentCommentId: parentId,
      });

      setReplyText({ ...replyText, [parentId]: "" });
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/comment/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editedText.trim()) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/comment/${commentId}`, {
        content: editedText,
      });

      const updated = comments.map((c) =>
        c.id === commentId ? { ...c, content: res.data.updatedComment.content } : c
      );
      setComments(updated);
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const renderComment = (comment) => (
    <div key={comment.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2">
      <p className="font-semibold text-gray-300">{comment.username}</p>

      {editingCommentId === comment.id ? (
        <>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-1 rounded bg-gray-700 text-white"
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => handleEdit(comment.id)}
              className="text-green-400 hover:underline"
            >
              Save
            </button>
            <button
              onClick={() => setEditingCommentId(null)}
              className="text-red-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-400">{comment.content}</p>
      )}

      {/* Edit/Delete Buttons (Only for author) */}
      {currentUser?.id === comment.user_id && (
        <div className="flex gap-3 mt-1">
          <button
            onClick={() => {
              setEditingCommentId(comment.id);
              setEditedText(comment.content);
            }}
            className="text-yellow-400 text-sm hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(comment.id)}
            className="text-red-400 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      )}

      {/* Reply Input */}
      <div className="mt-2 ml-3">
        <input
          type="text"
          value={replyText[comment.id] || ""}
          onChange={(e) =>
            setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))
          }
          placeholder="Write a reply..."
          className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded-md"
        />
        <button
          onClick={() => handleReplySubmit(comment.id)}
          className="mt-1 text-blue-400 text-sm hover:underline"
        >
          Reply
        </button>
      </div>
    </div>
  );

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
              comments.map(renderComment)
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
