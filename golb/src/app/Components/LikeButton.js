import { useState, useEffect } from "react";
import axios from "axios";

const LikeButton = ({ postId, userId }) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Fetch the current like status
    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/likes/${postId}`);
                setLikeCount(response.data.count);
                setLiked(response.data.likedByUser);
            } catch (error) {
                console.error("Error fetching like status", error);
            }
        };

        fetchLikes();
    }, [postId, userId]);

    // Handle Like/Unlike
    const toggleLike = async () => {
        try {
            if (liked) {
                await axios.delete(`http://localhost:5000/api/unlike/${postId}`, { data: { userId } });
                setLikeCount((prev) => prev - 1);
            } else {
                await axios.post("http://localhost:5000/api/like", { userId, postId });
                setLikeCount((prev) => prev + 1);
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Error updating like", error);
        }
    };

    return (
        <button onClick={toggleLike} className="like-button">
            {liked ? "❤️" : "🤍"} {likeCount}
        </button>
    );
};

export default LikeButton;
