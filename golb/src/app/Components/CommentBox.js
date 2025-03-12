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
        const res = await axios.get(`/api/comments/${postId}`);
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
      const res = await axios.post("/api/comment", {
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
    <div className="mt-4 border-t pt-4">
      <h3 className="font-bold text-lg">Comments</h3>

      {/* ✅ Comment Input */}
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* ✅ Comments List */}
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-2 border-b">
              <p className="font-bold">{comment.username}</p>
              <p>{comment.content}</p>
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
