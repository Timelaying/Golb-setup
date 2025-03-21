import { useState, useEffect } from "react";
import axios from "axios";

const CommentBox = ({ postId, userId }) => {
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  useEffect(() => {
    if (show) fetchComments();
  }, [show]);

  const handleAddComment = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/comment`, {
        userId,
        postId,
        content,
      });

      setComments([res.data, ...comments]);
      setContent("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setShow(!show)}
        className="text-blue-400 underline"
      >
        {show ? "Hide Comments" : "View Comments"}
      </button>

      {show && (
        <div className="mt-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded mb-2"
          />
          <button
            onClick={handleAddComment}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Posting..." : "Post"}
          </button>

          <div className="mt-4 space-y-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="p-2 bg-gray-700 rounded">
                  <p className="text-sm font-bold text-gray-200">@{comment.username}</p>
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentBox;
