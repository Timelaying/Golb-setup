// golb/src/app/Frontend/Feeds/page.js

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
import PageWrapper from "@/app/Components/PageWrapper";
import CardContainer from "@/app/Components/CardContainer";
import PageHeader from "@/app/Components/PageHeader";

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
    <PageWrapper>
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md relative z-20">
        <h1 className="text-2xl font-bold">Feed</h1>
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
                <Link href="/Frontend/Profile" className="block text-sm">Profile</Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-600">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/Frontend";
                  }}
                  className="block text-sm w-full text-left"
                >Logout</button>
              </li>
              <li className="px-4 py-2 hover:bg-gray-600 rounded-b">
                <Link href="/Frontend/CreatePost" className="block text-sm">Create Post</Link>
              </li>
            </ul>
          )}
        </div>
      </header>

      {/* Search */}
      <div className="relative z-10 px-6 py-2">
        <SearchBar onSearchResults={setFeed} />
      </div>

      {/* Feed List */}
      <main className="flex-1 p-4 overflow-y-auto">
        {feed.length > 0 ? (
          feed.map((post) => (
            <CardContainer key={post.id} className="mb-4">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-400">{post.content}</p>
              <div className="flex items-center space-x-3 mt-2 mb-1">
                <img
                  src={post.profile_picture ? `http://localhost:5000${post.profile_picture}` : "/default-avatar.png"}
                  alt={post.username}
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="text-gray-300 text-sm font-medium">Posted by @{post.username}</span>
              </div>
              <FollowButton userId={post.user_id} currentUserId={currentUser.id} />
              <LikeButton postId={post.id} userId={currentUser.id} />
              <CommentBox postId={post.id} />
            </CardContainer>
          ))
        ) : (
          <p className="text-center text-gray-400">No posts found</p>
        )}
      </main>
    </PageWrapper>
  );
}
