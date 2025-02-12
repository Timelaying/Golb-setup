"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:5000/api/users/${username}`
        );
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          `http://localhost:5000/api/posts?username=${username}`
        );
        setPosts(postsResponse.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (username) fetchUserProfile();
  }, [username]);

  if (!user) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <img
          src={user.profile_picture || "/default-avatar.png"}
          alt={user.username}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-2xl text-white font-bold">{user.name}</h1>
          <p className="text-gray-400">@{user.username}</p>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl text-white font-bold">Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-4 bg-gray-800 rounded mt-2">
              <h3 className="text-white font-bold">{post.title}</h3>
              <p className="text-gray-300">{post.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No posts found</p>
        )}
      </div>
    </div>
  );
}
