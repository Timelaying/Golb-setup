import LikeButton from "./LikeButton";
import CommentBox from "./CommentBox";

const PostCard = ({ post, userId }) => {
  return (
    <div className="bg-gray-800 p-4 rounded shadow mb-6 text-white border border-gray-700">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-300 mb-2">{post.content}</p>

      <LikeButton postId={post.id} userId={userId} />
      <CommentBox postId={post.id} userId={userId} />
    </div>
  );
};

export default PostCard;
