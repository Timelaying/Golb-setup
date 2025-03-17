"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PostCard from "@/app/Components/PostCard";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${username}`);
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (isLoading) return <p className="text-gray-300 text-center">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!profile) return <p className="text-gray-400 text-center">No profile data available.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-100 px-4">
      <div className="max-w-2xl w-full bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Profile Header */}
        <div className="text-center">
          <img
            src={profile.profile_picture || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-3 border border-gray-500"
          />
          <h1 className="text-3xl font-semibold">{profile.name}</h1>
          <p className="text-gray-400">@{profile.username}</p>
          <p className="text-gray-300 mt-2">{profile.bio || "No bio available"}</p>
          <p className="text-gray-300">📧 {profile.email}</p>
        </div>

        {/* Profile Stats */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-300">Stats</h2>
          <p className="text-gray-400">📝 Posts: {profile.posts.length}</p>
          <p className="text-gray-400">👥 Followers: {profile.followersCount || 0}</p>
          <p className="text-gray-400">📌 Following: {profile.followingCount || 0}</p>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-300 mb-3">Posts</h2>
          {profile.posts.length === 0 ? (
            <p className="text-gray-400">No posts available.</p>
          ) : (
            <div className="space-y-4">
              {profile.posts.map((post) => (
                <PostCard key={post.id} post={post} userId={profile.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
