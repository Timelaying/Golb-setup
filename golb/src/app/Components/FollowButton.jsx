"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function FollowButton({ userId, isFollowing, refreshUsers }) {
  const handleFollow = async () => {
    try {
      await axios.post("http://localhost:5000/api/follow", {
        followerId: localStorage.getItem("userId"),
        followingId: userId,
      });
      refreshUsers();
    } catch (error) {
      console.error("Follow/unfollow error:", error);
    }
  };

  return (
    <Button onClick={handleFollow}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
