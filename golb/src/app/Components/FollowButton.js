import { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ userId, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // ✅ Get access token
        if (!token) {
          console.error("❌ No access token found. Please log in.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/follow/status/${currentUserId}/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } } // ✅ Include token
        );

        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    checkFollowStatus();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // ✅ Get access token
      if (!token) {
        console.error("❌ No access token found. Please log in.");
        return;
      }

      const endpoint = isFollowing ? "/unfollow" : "/follow";
      await axios.post(
        `http://localhost:5000/api${endpoint}/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Include token
      );

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
        isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
