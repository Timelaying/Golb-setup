import { useState, useEffect } from "react";
import axios from "axios";

const LikeButton = ({ postId, userId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Fetch like count and check if the user has liked the post
    const fetchLikes = async () => {
      try {
        const likeCountRes = await axios.get(`/api/likes/${postId}`);
        setLikes(likeCountRes.data.likes);

        const userLikeRes = await axios.get(`/api/user-likes/${userId}/${postId}`);
        setLiked(userLikeRes.data.liked);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [postId, userId]);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.post("/api/unlike", { userId, postId });
        setLikes((prev) => prev - 1);
      } else {
        await axios.post("/api/like", { userId, postId });
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded-md ${
        liked ? "bg-red-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
};

export default LikeButton;
