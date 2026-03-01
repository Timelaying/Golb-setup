import LikeButton from "./LikeButton";
import CommentBox from "./CommentBox";

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-800 text-gray-100 border border-gray-700 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-200">{post.title}</h2>
      <p className="text-gray-300">{post.content}</p>

      <LikeButton postId={post.id} />
      <CommentBox postId={post.id} />
    </div>
  );
};

export default PostCard;
