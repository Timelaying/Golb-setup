import { useState, useEffect } from "react";
import axios from "axios";

const LikeButton = ({ postId, userId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikeData = async () => {
    try {
      const [likeCountRes, userLikeRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/likes/${postId}`),
        axios.get(`http://localhost:5000/api/user-likes/${userId}/${postId}`),
      ]);

      setLikes(likeCountRes.data.likes);
      setLiked(userLikeRes.data.liked);
    } catch (err) {
      console.error("Error fetching like data:", err);
    }
  };

  useEffect(() => {
    fetchLikeData();
  }, [postId, userId]);

  const handleLikeToggle = async () => {
    try {
      const endpoint = liked ? "unlike" : "like";
      const response = await axios.post(`http://localhost:5000/api/${endpoint}`, {
        userId,
        postId,
      });

      setLikes(response.data.likes);
      setLiked(!liked);
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      className={`px-4 py-2 rounded-md transition ${
        liked ? "bg-red-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
};

export default LikeButton;
