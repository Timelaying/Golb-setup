"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import useCurrentUser from "@/app/utils/useCurrentUser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/app/Components/SearchBar";
import FollowButton from "@/app/Components/FollowButton";
import LikeButton from "@/app/Components/LikeButton";
import CommentBox from "@/app/Components/CommentBox";

export default function FeedPage() {
  const currentUser = useCurrentUser();
  const [feed, setFeed] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchFeed(currentUser.id);
    }
  }, [currentUser]);

  const fetchFeed = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/feed/${userId}`);
      setFeed(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md relative z-20">
        <h1 className="text-2xl font-bold">Your Feed</h1>

        {/* Dropdown Menu */}
        <div className="relative">
          <button
            className="bg-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </button>
          {menuOpen && (
            <ul className="absolute right-0 mt-2 w-40 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-30">
              <li className="px-4 py-2 hover:bg-gray-600 rounded-t">
                <Link href="/Frontend/Profile" className="block text-sm">
                  Profile
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-600">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/Frontend";
                  }}
                  className="block text-sm w-full text-left"
                >
                  Logout
                </button>
              </li>
              <li className="px-4 py-2 hover:bg-gray-600 rounded-b">
                <Link href="/Frontend/CreatePost" className="block text-sm">
                  Create Post
                </Link>
              </li>
            </ul>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="px-6 py-3 bg-gray-900 border-b border-gray-700 z-10">
        <SearchBar onSearchResults={setFeed} />
      </div>

      {/* Feed List */}
      <main className="flex-1 p-4 overflow-y-auto">
        {feed.length > 0 ? (
          feed.map((post) => (
            <div
              key={post.id}
              className="border border-gray-700 p-4 bg-gray-800 rounded-lg shadow-md mb-6"
            >
              <h2 className="text-xl font-semibold text-white">{post.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{post.content}</p>

              <div className="flex items-center space-x-3 mt-3">
                <img
                  src={
                    post.profile_picture
                      ? `http://localhost:5000${post.profile_picture}`
                      : "/default-avatar.png"
                  }
                  alt={post.username || "User"}
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="text-gray-300 text-sm font-medium">
                  @{post.username}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <FollowButton userId={post.user_id} currentUserId={currentUser.id} />
                <LikeButton postId={post.id} userId={currentUser.id} />
              </div>

              <div className="mt-4">
                <CommentBox postId={post.id} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-20">No posts yet. Start by following users or creating your own post.</p>
        )}
      </main>
    </div>
  );
}
