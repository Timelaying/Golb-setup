"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/app/components/SearchBar";
import FollowButton from "@/app/components/FollowButton";
import LikeButton from "@/app/components/LikeButton";
import CommentBox from "@/app/components/CommentBox";

export default function FeedPage() {
  const [feed, setFeed] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:5000/api/feed/${userId}`);
      setFeed(response.data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-500">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md relative z-20">
        <h1 className="text-2xl font-bold">Feed</h1>

        {/* Menu Dropdown (Click-to-Toggle) */}
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

      {/* Search Bar */}
      <div className="relative z-10 px-6 py-2">
        <SearchBar onSearchResults={setFeed} />
      </div>

      {/* Feed List */}
      <main className="flex-1 p-4 overflow-y-auto">
        {feed.length > 0 ? (
          feed.map((post) => (
            <div key={post.id} className="border-b border-gray-700 p-4 bg-gray-800 rounded-lg shadow mb-4">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-400">{post.content}</p>

              <FollowButton userId={post.user_id} isFollowing={post.isFollowing} refreshUsers={fetchFeed} />
              <LikeButton postId={post.id} isLiked={post.isLiked} refreshPosts={fetchFeed} />
              <CommentBox postId={post.id} refreshPosts={fetchFeed} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No posts found</p>
        )}
      </main>
    </div>
  );
}
