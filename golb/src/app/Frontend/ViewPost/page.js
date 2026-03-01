"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useCurrentUser from "@/app/utils/useCurrentUser";
import PageWrapper from "@/app/Components2/PageWrapper";
import CardContainer from "@/app/Components2/CardContainer";
import PageHeader from "@/app/Components2/PageHeader";

export default function PostsList() {
  const currentUser = useCurrentUser();

  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [replyText, setReplyText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:5000/api/viewposts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data.posts);
        setPostCount(response.data.count);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:5000/api/viewcomments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => ({ ...prev, [postId]: response.data.comments }));
    } catch (err) {
      console.error("Error fetching comments:", err.message);
    }
  };

  const toggleComments = (postId) => {
    const alreadyExpanded = expandedPostId === postId;
    setExpandedPostId(alreadyExpanded ? null : postId);
    if (!alreadyExpanded && !comments[postId]) fetchComments(postId);
  };

  const handleReplyChange = (commentId, value) => {
    setReplyText((prev) => ({ ...prev, [commentId]: value }));
  };

  const submitReply = async (postId, parentCommentId) => {
    const token = localStorage.getItem("accessToken");
    const content = replyText[parentCommentId];
    if (!content || !currentUser) return;
    try {
      await axios.post("http://localhost:5000/api/addcomment", {
        userId: currentUser.id,
        postId,
        content,
        parentCommentId,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReplyText({});
      fetchComments(postId);
    } catch (err) {
      console.error("Error submitting reply:", err.message);
    }
  };

  const startEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditText((prev) => ({ ...prev, [commentId]: content }));
  };

  const saveEdit = async (commentId, postId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(`http://localhost:5000/api/comment/${commentId}`, {
        userId: currentUser.id,
        content: editText[commentId],
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEditingCommentId(null);
      fetchComments(postId);
    } catch (err) {
      console.error("Error saving edited comment:", err.message);
    }
  };

  const deleteComment = async (commentId, postId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`http://localhost:5000/api/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(postId);
    } catch (err) {
      console.error("Error deleting comment:", err.message);
    }
  };

  const renderComments = (postId, commentsList) =>
    commentsList.map((comment) => (
      <div key={comment.id} className="border p-2 my-2 rounded bg-gray-100">
        <div className="flex items-center space-x-2 mb-1">
          <img
            src={comment.profile_picture ? `http://localhost:5000/uploads/users/${comment.username}/profile.jpg` : "/default-avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm text-gray-700 font-medium">
            @{comment.username}
            <span className="ml-2 text-xs text-gray-500">
              • {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        {editingCommentId === comment.id ? (
          <div>
            <textarea
              value={editText[comment.id]}
              onChange={(e) => setEditText((prev) => ({ ...prev, [comment.id]: e.target.value }))}
              className="w-full border p-1 mb-2"
            />
            <div className="space-x-2">
              <button onClick={() => saveEdit(comment.id, postId)} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
              <button onClick={() => setEditingCommentId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-800">{comment.content}</p>
        )}
        {currentUser?.id === comment.user_id && (
          <div className="mt-1 text-sm space-x-2">
            <button onClick={() => startEdit(comment.id, comment.content)} className="text-blue-600 hover:underline">Edit</button>
            <button onClick={() => deleteComment(comment.id, postId)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
        <div className="ml-4 mt-2">
          <input
            type="text"
            value={replyText[comment.id] || ""}
            onChange={(e) => handleReplyChange(comment.id, e.target.value)}
            className="border p-1 w-full"
            placeholder="Reply..."
          />
          <button onClick={() => submitReply(postId, comment.id)} className="bg-blue-500 text-white px-2 py-1 mt-1">Reply</button>
        </div>
        {comment.replies?.length > 0 && (
          <div className="ml-6 border-l pl-2 mt-2">
            {renderComments(postId, comment.replies)}
          </div>
        )}
      </div>
    ));

  return (
    <PageWrapper>
      <CardContainer>
        <PageHeader title="My Posts" />
        <p className="text-gray-400 text-center mb-6">
          You have created <span className="font-bold text-white">{postCount}</span> post(s).
        </p>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        ) : postCount === 0 ? (
          <p className="text-center text-gray-400">You haven’t created any posts yet.</p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li key={post.id} className="p-4 border border-gray-700 rounded-lg bg-gray-700 shadow">
                <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                <p className="text-gray-300">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created on: {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="text-gray-400">
                  👍 {post.like_count} Likes | 💬 {post.comment_count} Comments
                </p>
                <button onClick={() => toggleComments(post.id)} className="text-blue-400 hover:underline mt-2">
                  {expandedPostId === post.id ? "Hide Comments" : "View Comments"}
                </button>
                {expandedPostId === post.id && (
                  <div className="mt-4 bg-gray-600 p-3 rounded">
                    <h3 className="text-white font-semibold">Comments</h3>
                    {comments[post.id]?.length > 0 ? (
                      renderComments(post.id, comments[post.id])
                    ) : (
                      <p className="text-gray-300">No comments yet.</p>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-center">
          <Link href="/Frontend/Feeds">
            <Button className="bg-blue-600 hover:bg-blue-700 transition">
              Back to Feeds
            </Button>
          </Link>
        </div>
      </CardContainer>
    </PageWrapper>
  );
}
