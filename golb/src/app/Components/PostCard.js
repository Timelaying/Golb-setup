import LikeButton from "./LikeButton";
import CommentSection from "./CommentBox";

const PostCard = ({ post, userId }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-bold">{post.title}</h2>
      <p>{post.content}</p>

      {/* ✅ Like Button */}
      <LikeButton postId={post.id} userId={userId} />

      {/* ✅ Comment Section */}
      <CommentSection postId={post.id} userId={userId} />
    </div>
  );
};

export default PostCard;
