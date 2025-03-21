"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(
          "http://localhost:5000/api/viewposts",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setPosts(response.data.posts);
        setPostCount(response.data.count);
      } catch (error) {
        console.error(
          "Error fetching posts:",
          error.response?.data?.error || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const fetchComments = async (postId) => {
    console.log("Fetching comments for post:", postId); // ✅ Debugging log
    try {
      const response = await axios.get(`http://localhost:5000/api/viewcomments/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      console.log("Fetched comments:", response.data); // ✅ Log fetched data
      setComments((prev) => ({ ...prev, [postId]: response.data.comments }));
    } catch (error) {
      console.error("Error fetching comments:", error.response?.data || error.message);
    }
  };
  

  const toggleComments = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null); // Collapse if already open
    } else {
      setExpandedPostId(postId);
      if (!comments[postId]) fetchComments(postId);
    }
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }));
  };

  const submitReply = async (postId, parentCommentId) => {
    if (!replyText[parentCommentId]) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/addcomment", // ✅ Ensure correct API path
        {
          userId: localStorage.getItem("userId"), // ✅ Ensure this exists
          postId,
          content: replyText[parentCommentId], 
          parentCommentId,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        }
      );
      

      if (response.status === 200) {
        setReplyText({}); // Clear input after submission
        fetchComments(postId); // Reload comments
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const renderComments = (postId, commentsList) => {
    return commentsList.map((comment) => (
      <div key={comment.id} className="border p-2 my-2 rounded bg-gray-100">
       <strong>{comment.username}</strong>: {comment.content}


        {/* Reply input */}
        <div className="ml-4 mt-2">
          <input
            type="text"
            value={replyText[comment.id] || ""}
            onChange={(e) => handleReplyChange(comment.id, e.target.value)}
            className="border p-1 w-full"
            placeholder="Reply..."
          />
          <button
            onClick={() => submitReply(postId, comment.id)}
            className="bg-blue-500 text-white px-2 py-1 mt-1"
          >
            Reply
          </button>
        </div>

        {/* Render replies */}
        {comment.replies.length > 0 && (
          <div className="ml-6 border-l pl-2 mt-2">
            {renderComments(postId, comment.replies)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
      <div className="max-w-3xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-4">My Posts</h1>
        <p className="text-gray-400 text-center mb-6">
          You have created{" "}
          <span className="font-bold text-white">{postCount}</span> post(s).
        </p>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        ) : postCount === 0 ? (
          <p className="text-center text-gray-400">
            You haven’t created any posts yet.
          </p>
        ) : (
          <ul className="space-y-5">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-4 border border-gray-700 rounded-lg bg-gray-700 shadow"
              >
                <h2 className="text-xl font-semibold text-white">
                  {post.title}
                </h2>
                <p className="text-gray-300">{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created on: {new Date(post.created_at).toLocaleString()}
                </p>
                {/* Show likes and comments count */}
                <p className="text-gray-400">
                  👍 {post.like_count} Likes | 💬 {post.comment_count} Comments
                </p>

                {/* Toggle Comments Button */}
                <button
                  onClick={() => toggleComments(post.id)}
                  className="text-blue-400 hover:underline mt-2"
                >
                  {expandedPostId === post.id ? "Hide Comments" : "View Comments"}
                </button>

                {/* Comments Section */}
                {expandedPostId === post.id && (
                  <div className="mt-4 bg-gray-600 p-3 rounded">
                    <h3 className="text-white font-semibold">Comments</h3>
                    {comments[post.id] && comments[post.id].length > 0 ? (
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
      </div>
    </div>
  );
}
