"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("You are not logged in.");
          return;
        }

        // Fetch user profile
        const profileRes = await axios.get(`http://localhost:5000/api/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(profileRes.data);

        // Fetch user posts
        const postsRes = await axios.get(`http://localhost:5000/api/posts/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsRes.data);

        // Check if current user follows this profile
        const followRes = await axios.get(`http://localhost:5000/api/follow/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFollowing(followRes.data.isFollowing);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5000/api/follow/${username}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/unfollow/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId, commentText) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return <p className="text-center">No profile data available.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h1 className="text-xl font-bold">{profile.name} (@{profile.username})</h1>
        <p className="text-gray-600">{profile.bio || "No bio available"}</p>
        <p className="text-gray-500">Email: {profile.email}</p>
        {isFollowing ? (
          <button onClick={handleUnfollow} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
            Unfollow
          </button>
        ) : (
          <button onClick={handleFollow} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
            Follow
          </button>
        )}
      </div>

      <h2 className="text-lg font-semibold mt-6">Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4 mt-4">
            <p className="text-gray-800">{post.content}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-600">{post.likes} Likes</span>
              <button onClick={() => handleLike(post.id)} className="text-blue-500">
                Like ❤️
              </button>
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Write a comment..."
                className="border rounded-md p-2 w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment(post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 mt-4">No posts available.</p>
      )}
    </div>
  );
}
