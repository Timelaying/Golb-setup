import { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!accessToken) {
        console.error("❌ No access token found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/following/${userId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setIsFollowing(response.data.isFollowing); // ✅ Use the new API response
      } catch (error) {
        console.error("❌ Error checking follow status:", error.response?.data || error.message);
      }
    };

    checkFollowStatus();
  }, [userId, accessToken]);

  const handleFollow = async () => {
    if (!accessToken) {
      console.error("❌ No access token found. Please log in.");
      return;
    }

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await axios.post(
        `http://localhost:5000/api/${endpoint}/${userId}`,
        {}, // ✅ Ensure empty body if required
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log("✅ Follow action successful:", response.data);
      setIsFollowing(!isFollowing); // ✅ Toggle button state
    } catch (error) {
      console.error("❌ Error updating follow status:", error.response?.data || error.message);
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
