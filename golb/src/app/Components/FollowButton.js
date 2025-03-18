import { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ userId, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/follow/status/${currentUserId}/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Follow status fetched:", response.data);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error.response?.data || error.message);
      }
    };

    checkFollowStatus();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    console.log("Follow button clicked!");
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No auth token found in localStorage");
      alert("Authentication error: Please log in again.");
      return;
    }
  
    try {
      console.log("Sending request to:", isFollowing 
        ? `http://localhost:5000/api/unfollow/${userId}` 
        : `http://localhost:5000/api/follow/${userId}`
      );
  
      const headers = { Authorization: `Bearer ${token}` };
  
      if (isFollowing) {
        await axios.delete(`http://localhost:5000/api/unfollow/${userId}`, { headers });
      } else {
        await axios.post(`http://localhost:5000/api/follow/${userId}`, {}, { headers });
      }
  
      console.log("✅ Follow/unfollow request successful");
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("❌ Error updating follow status:", error.response?.data || error.message);
    }
  };
  
  

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-white transition-all duration-300 ${
        isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
