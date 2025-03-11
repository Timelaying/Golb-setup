"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

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
        <ul>
          {profile.posts.map((post) => (
            <li key={post.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" style={{ width: "100%", maxWidth: "400px" }} />}
              <p><small>{new Date(post.created_at).toLocaleString()}</small></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
