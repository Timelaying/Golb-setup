import { useState } from "react";
import LikeButton from "./LikeButton";
import CommentPopup from "./CommentPopup";

const Post = ({ post, userId }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <LikeButton postId={post.id} userId={userId} />
            <button onClick={() => setShowPopup(true)}>💬 Comment</button>

            {showPopup && <CommentPopup postId={post.id} userId={userId} onClose={() => setShowPopup(false)} />}
        </div>
    );
};

export default Post;
