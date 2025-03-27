"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PageWrapper from "@/app/Components/PageWrapper";
import CardContainer from "@/app/Components/CardContainer";
import PageHeader from "@/app/Components/PageHeader";
import LikeButton from "@/app/Components/LikeButton";
import CommentBox from "@/app/Components/CommentBox";
import FollowButton from "@/app/Components/FollowButton";
import useCurrentUser from "@/app/utils/useCurrentUser";

export default function BookmarksPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://localhost:5000/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchBookmarks();
  }, [currentUser]);

  return (
    <PageWrapper>
      <PageHeader title="Your Bookmarked Posts" />

      {loading ? (
        <p className="text-center text-gray-400 mt-6">Loading bookmarks...</p>
      ) : bookmarkedPosts.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">You have not bookmarked any posts yet.</p>
      ) : (
        <div className="space-y-6 max-w-5xl w-full">
          {bookmarkedPosts.map((post) => (
            <CardContainer key={post.id}>
              <h2 className="text-lg font-semibold mb-1">{post.title}</h2>
              <p className="text-sm text-gray-400">{post.content}</p>

              <div className="flex items-center space-x-3 mt-4 mb-2">
                <img
                  src={post.profile_picture ? `http://localhost:5000${post.profile_picture}` : "/default-avatar.png"}
                  alt={post.username}
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="text-gray-300 text-sm font-medium">@{post.username}</span>
              </div>

              <div className="flex gap-4 mt-2 mb-2">
                <FollowButton userId={post.user_id} currentUserId={currentUser?.id} />
                <LikeButton postId={post.id} userId={currentUser?.id} />
              </div>

              <CommentBox postId={post.id} />
            </CardContainer>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/Frontend/Feeds">
          <button className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">⬅ Back to Feed</button>
        </Link>
      </div>
    </PageWrapper>
  );
}
