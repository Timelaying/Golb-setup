const LikeButton = ({ postId, userId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likeCountRes = await axios.get(`http://localhost:5000/api/likes/${postId}`);
        setLikes(likeCountRes.data.likes);

        const userLikeRes = await axios.get(`http://localhost:5000/api/user-likes/${userId}/${postId}`);
        setLiked(userLikeRes.data.liked);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchLikes();
  }, [postId, userId]);

  const handleLike = async () => {
    try {
      const res = liked
        ? await axios.post("http://localhost:5000/api/unlike", { userId, postId })
        : await axios.post("http://localhost:5000/api/like", { userId, postId });

      setLikes(res.data.likes); // Update likes with correct count
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded-md transition ${
        liked ? "bg-red-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
};

export default LikeButton;
