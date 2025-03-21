import { useState, useEffect } from "react";
import axios from "axios";

const CommentBox = ({ postId, userId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState({});
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
  }, [showComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/comment", {
        userId,
        postId,
        content: newComment,
      });

      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }

    setLoading(false);
  };

  const handleReplySubmit = async (parentCommentId) => {
    const content = replyText[parentCommentId];
    if (!content?.trim()) return;

    try {
      const res = await axios.post("http://localhost:5000/api/reply", {
        userId,
        postId,
        content,
        parentCommentId,
      });

      // Refresh comments after reply is added
      setReplyText((prev) => ({ ...prev, [parentCommentId]: "" }));
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const renderReplies = (replies) => {
    return (
      <div className="ml-4 mt-2 space-y-2">
        {replies.map((reply) => (
          <div key={reply.id} className="bg-gray-700 p-2 rounded">
            <p className="text-sm font-medium text-blue-300">{reply.username}</p>
            <p className="text-gray-300">{reply.content}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderComments = () => {
    return comments.map((comment) => (
      <div key={comment.id} className="bg-gray-800 border border-gray-700 rounded p-3 mb-2">
        <p className="font-semibold text-gray-200">{comment.username}</p>
        <p className="text-gray-300">{comment.content}</p>

        {/* Reply input */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText[comment.id] || ""}
            onChange={(e) =>
              setReplyText((prev) => ({ ...prev, [comment.id]: e.target.value }))
            }
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          <button
            onClick={() => handleReplySubmit(comment.id)}
            className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reply
          </button>
        </div>

        {comment.replies && renderReplies(comment.replies)}
      </div>
    ));
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
          <h3 className="font-semibold text-lg text-gray-200 mt-3">Comments</h3>

          {/* Input for new comment */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-2 bg-gray-800 text-gray-100 border border-gray-600 rounded-md"
            />
            <button
              onClick={handleAddComment}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-500"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {/* Comment List */}
          <div className="mt-4">
            {comments.length > 0 ? renderComments() : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CommentBox;
