import { useState } from "react";
import LikeButton from "./LikeButton";
import CommentPopup from "./CommentPopup";

const Post = ({ post, userId }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
        <div className="border p-4 rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-bold">{post.title}</h2>
        <p>{post.content}</p>
        <LikeButton postId={post.id} userId={userId} />
      </div>
            <button onClick={() => setShowPopup(true)}>💬 Comment</button>

            {showPopup && <CommentPopup postId={post.id} userId={userId} onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default Post;
