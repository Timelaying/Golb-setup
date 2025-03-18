import { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ userId, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await axios.get(
          `http://localhost:5000/api/follow/status/${currentUserId}/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Include token in request
          }
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error.response?.data || error.message);
      }
    };

    checkFollowStatus();
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    if (loading) return; // Prevent multiple requests
    setLoading(true);

    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState); // Optimistic UI update

    try {
      const token = localStorage.getItem("token");
      const endpoint = newFollowState ? "follow" : "unfollow";
      await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        {
          followerId: currentUserId,
          followingId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Secure the request
        }
      );
    } catch (error) {
      console.error("Error updating follow status:", error.response?.data || error.message);
      setIsFollowing(!newFollowState); // Revert UI update on failure
    } finally {
      setLoading(false);
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
