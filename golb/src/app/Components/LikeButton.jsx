// components/LikeButton.jsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import useCurrentUser from "../utils/useCurrentUser";

const LikeButton = ({ postId }) => {
  const currentUser = useCurrentUser();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!currentUser) return;

      try {
        const likeCountRes = await axios.get(`http://localhost:5000/api/likes/${postId}`);
        setLikes(likeCountRes.data.likes);

        const userLikeRes = await axios.get(
          `http://localhost:5000/api/user-likes/${currentUser.id}/${postId}`
        );
        setLiked(userLikeRes.data.liked);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [postId, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;

    try {
      const endpoint = liked ? "unlike" : "like";
      const res = await axios.post(`http://localhost:5000/api/${endpoint}`, {
        userId: currentUser.id,
        postId,
      });

      setLikes(res.data.likes);
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded-md transition duration-300 text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        liked ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-black hover:bg-gray-400"
      }`}
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
};

export default LikeButton;
