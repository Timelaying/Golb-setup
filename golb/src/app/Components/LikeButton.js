import { useState, useEffect } from "react";
import axios from "axios";

const LikeButton = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const fetchStatus = async () => {
    try {
      const res1 = await axios.get(`http://localhost:5000/api/user-likes/${userId}/${postId}`);
      const res2 = await axios.get(`http://localhost:5000/api/likes/${postId}`);
      setLiked(res1.data.liked);
      setLikes(res2.data.likes);
    } catch (error) {
      console.error("❌ Error fetching like status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [postId, userId]);

  const toggleLike = async () => {
    try {
      const endpoint = liked ? "unlike" : "like";
      const res = await axios.post(`http://localhost:5000/api/${endpoint}`, {
        userId,
        postId,
      });

      setLikes(res.data.likes);
      setLiked(!liked);
    } catch (error) {
      console.error("❌ Error toggling like:", error);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`px-3 py-1 mt-2 rounded ${liked ? "bg-red-600 text-white" : "bg-gray-300 text-black"}`}
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
};

export default LikeButton;
