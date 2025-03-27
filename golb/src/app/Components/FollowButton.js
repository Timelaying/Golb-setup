import { useEffect, useState } from "react";
import axios from "axios";
import useCurrentUser from "@/app/utils/useCurrentUser";

export default function FollowButton({ userId }) {
  const currentUser = useCurrentUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!currentUser?.id) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/following/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error fetching follow status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [userId, currentUser?.id]);

  const handleToggleFollow = async () => {
    if (!currentUser?.id) return;
    try {
      const endpoint = isFollowing ? `/unfollow/${userId}` : `/follow/${userId}`;
      const method = isFollowing ? "delete" : "post";

      await axios({
        method,
        url: `http://localhost:5000/api${endpoint}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      setIsFollowing((prev) => !prev);
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  };

  if (loading || currentUser?.id === userId) return null;

  return (
    <button
      onClick={handleToggleFollow}
      className={`mt-2 px-4 py-1 rounded text-white text-sm transition-all duration-200 ${
        isFollowing ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}