import { useState } from "react";
import LikeButton from "./LikeButton";
import CommentSection from "./CommentBox";

const PostCard = ({ post, userId }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-gray-800 text-gray-100 border border-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-200">{post.title}</h2>
      <p className="text-gray-300">{post.content}</p>

      {/* ✅ Like Button */}
      <LikeButton postId={post.id} userId={userId} />

      {/* ✅ Show/Hide Comment Section */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="mt-2 text-blue-400 underline"
      >
        {showComments ? "Hide Comments" : "View Comments"}
      </button>

      {showComments && <CommentSection postId={post.id} userId={userId} />}
    </div>
  );
};

export default PostCard;
