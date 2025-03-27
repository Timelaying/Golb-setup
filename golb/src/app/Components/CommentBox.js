"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import useCurrentUser from "@/app/utils/useCurrentUser";
import CommentItem from "./CommentItem";

export default function CommentBox({ postId }) {
  const currentUser = useCurrentUser();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
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

  const handleReplySubmit = async (parentCommentId, content) => {
    if (!content || !currentUser) return;
    try {
      await axios.post("http://localhost:5000/api/reply", {
        userId: currentUser.id,
        postId,
        content,
        parentCommentId,
      });
      fetchComments();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  const handleEditSubmit = async (commentId, content) => {
    try {
      await axios.put(`http://localhost:5000/api/comment/${commentId}`, {
        userId: currentUser.id,
        content,
      });
      fetchComments();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
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
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onReplySubmit={handleReplySubmit}
                  onEditSubmit={handleEditSubmit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
