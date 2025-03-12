import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function LikeButton({ postId, userId }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch initial like state and count
    axios.get(`/api/posts/${postId}/likes`).then((res) => {
      setLikeCount(res.data.likeCount);
    });
    axios.get(`/api/posts/${postId}/likes/${userId}`).then((res) => {
      setLiked(res.data.liked);
    });
  }, [postId, userId]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`/api/posts/${postId}/like`, { userId });
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 1500);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  return (
    <div className="relative flex items-center space-x-2">
      <Button
        onClick={handleLike}
        className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
      >
        <Heart className={liked ? "text-red-500 fill-red-500" : "text-gray-500"} size={20} />
        <span>{likeCount}</span>
      </Button>

      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg"
        >
          {liked ? "Liked!" : "Unliked!"}
        </motion.div>
      )}
    </div>
  );
}
