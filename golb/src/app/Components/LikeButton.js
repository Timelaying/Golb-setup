"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function LikeButton({ postId, isLiked, refreshPosts }) {
  const handleLike = async () => {
    try {
      await axios.post("http://localhost:5000/api/like", {
        userId: localStorage.getItem("userId"),
        postId,
      });
      refreshPosts();
    } catch (error) {
      console.error("Like/unlike error:", error);
    }
  };

  return <Button onClick={handleLike}>{isLiked ? "Unlike" : "Like"}</Button>;
}
