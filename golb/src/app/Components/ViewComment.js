import { useEffect, useState } from "react";

const CommentsSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState({});
    
    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/viewcomments/${postId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // If using auth
                },
            });
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleReplyChange = (commentId, text) => {
        setReplyText((prev) => ({ ...prev, [commentId]: text }));
    };

    const submitReply = async (parentCommentId) => {
        if (!replyText[parentCommentId]) return;

        try {
            const response = await fetch(`http://localhost:5000/addcomment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    postId,
                    text: replyText[parentCommentId],
                    parentCommentId, // Attach parent comment ID
                }),
            });

            if (response.ok) {
                setReplyText({}); // Clear input after submission
                fetchComments(); // Reload comments
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    const renderComments = (commentsList) => {
        return commentsList.map((comment) => (
            <div key={comment.id} className="border p-2 my-2 rounded bg-gray-100">
                <strong>{comment.username}</strong>: {comment.text}
                
                {/* Reply input */}
                <div className="ml-4 mt-2">
                    <input
                        type="text"
                        value={replyText[comment.id] || ""}
                        onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                        className="border p-1 w-full"
                        placeholder="Reply..."
                    />
                    <button
                        onClick={() => submitReply(comment.id)}
                        className="bg-blue-500 text-white px-2 py-1 mt-1"
                    >
                        Reply
                    </button>
                </div>

                {/* Render replies */}
                {comment.replies.length > 0 && (
                    <div className="ml-6 border-l pl-2 mt-2">
                        {renderComments(comment.replies)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div>
            <h2 className="text-xl font-bold">Comments</h2>
            {comments.length > 0 ? renderComments(comments) : <p>No comments yet.</p>}
        </div>
    );
};

export default CommentsSection;
