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
        const response = await axios.get(`http://localhost:5000/api/users/${username}`, {
          withCredentials: true
        });
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

  const toggleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/users/${profile.id}/follow`, {}, { withCredentials: true });
      setProfile((prev) => ({ ...prev, isFollowing: response.data.isFollowing }));
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, { withCredentials: true });
      setProfile((prev) => ({
        ...prev,
        posts: prev.posts.map(post => 
          post.id === postId ? { ...post, liked: response.data.liked, like_count: response.data.liked ? post.like_count + 1 : post.like_count - 1 } : post
        )
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (isLoading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <div className="profile-container">
      <h1>{profile.name} (@{profile.username})</h1>
      <img src={profile.profile_picture || "/default-avatar.png"} alt="Profile" className="profile-pic" />
      <p>{profile.bio || "No bio available"}</p>
      <button onClick={toggleFollow}>
        {profile.isFollowing ? "Unfollow" : "Follow"}
      </button>

      <h2>Posts</h2>
      {profile.posts.map(post => (
        <div key={post.id} className="post-card">
          <p>{post.content}</p>
          {post.image && <img src={`http://localhost:5000${post.image}`} alt="Post" />}
          <button onClick={() => toggleLike(post.id)}>
            {post.liked ? "Unlike" : "Like"} ({post.like_count})
          </button>
        </div>
      ))}
    </div>
  );
}
