import { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch comments when component loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
        setComments(res.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // ✅ Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/comment", {
        userId,
        postId,
        content: newComment,
      });

      setComments([res.data, ...comments]); // Update UI with new comment
      setNewComment(""); // Clear input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h3 className="font-semibold text-lg text-gray-200">Comments</h3>

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
          onClick={handleAddComment}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* ✅ Comments List */}
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2">
              <p className="font-semibold text-gray-300">{comment.username || "User"}</p>
              <p className="text-gray-400">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
