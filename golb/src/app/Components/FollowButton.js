import { useState, useEffect } from "react";
import axios from "axios";

const FollowButton = ({ userId, currentUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Check if the current user is following the target user
    axios
      .get(`/api/users/${currentUserId}/following/${userId}`)
      .then((response) => {
        setIsFollowing(response.data.isFollowing);
      })
      .catch((error) => console.error("Error checking follow status:", error));
  }, [userId, currentUserId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/api/users/${currentUserId}/unfollow/${userId}`);
      } else {
        await axios.post(`/api/users/${currentUserId}/follow/${userId}`);
      }
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
