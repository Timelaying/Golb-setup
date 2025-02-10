"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function CommentBox({ postId, refreshPosts }) {
  const [comment, setComment] = useState("");

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/comment", {
        userId: localStorage.getItem("userId"),
        postId,
        content: comment,
      });
      setComment("");
      refreshPosts();
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  return (
    <div className="p-2">
      <textarea
        placeholder="Write a comment..."
        className="border rounded p-2 w-full"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <Button onClick={handleComment}>Comment</Button>
    </div>
  );
}
