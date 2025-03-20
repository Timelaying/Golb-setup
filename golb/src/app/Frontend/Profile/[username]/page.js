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

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <div>
      <h1>{profile.name} (@{profile.username})</h1>
      <p>{profile.bio || "No bio available"}</p>
      <p>Email: {profile.email}</p>

      <h2>Posts</h2>
      {profile.posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <div className="space-y-4">
          {profile.posts.map((post) => (
            <PostCard key={post.id} post={post} userId={profile.id} />
          ))}
        </div>
      )}
    </div>
  );
}
