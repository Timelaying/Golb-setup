"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/api/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const toggleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!profile) return;

      if (profile.isFollowing) {
        await axios.post(`http://localhost:5000/api/unfollow/${profile.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile((prev) => ({ ...prev, isFollowing: false }));
      } else {
        await axios.post(`http://localhost:5000/api/follow/${profile.id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile((prev) => ({ ...prev, isFollowing: true }));
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      setError("Failed to update follow status.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{profile.name} (@{profile.username})</h1>
      <p>{profile.bio || "No bio available"}</p>
      <button onClick={toggleFollow} style={{ backgroundColor: profile.isFollowing ? "red" : "green" }}>
        {profile.isFollowing ? "Unfollow" : "Follow"}
      </button>
      <h2>Posts</h2>
      {profile.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.image && <img src={post.image} alt="Post" width="200" />}
          <p>👍 {post.likes_count} | 💬 {post.comments_count}</p>
        </div>
      ))}
    </div>
  );
}
