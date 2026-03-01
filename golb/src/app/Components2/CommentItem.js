"use client";

import { useState } from "react";
import useCurrentUser from "@/app/utils/useCurrentUser";

export default function CommentItem({ comment, postId, onReplySubmit, onEditSubmit, onDelete }) {
  const currentUser = useCurrentUser();
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, replyText);
    setReplyText("");
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    onEditSubmit(comment.id, editText);
    setIsEditing(false);
  };

  return (
    <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2">
      <p className="font-semibold text-gray-300">{comment.username}</p>

      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-400"
          />
          <div className="flex space-x-2 mt-1">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-400">{comment.content}</p>

          {currentUser && comment.user_id === currentUser.id && (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setIsEditing(true)}
                className="text-yellow-400 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {/* Reply Input */}
      <div className="mt-2 ml-4">
        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a reply..."
          className="w-full p-1 bg-gray-700 text-white border border-gray-600 rounded-md placeholder-gray-400"
        />
        <button
          onClick={handleReply}
          className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reply
        </button>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-6 border-l border-gray-600 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="mb-2">
              <p className="text-sm text-gray-300 font-medium">{reply.username}</p>
              <p className="text-sm text-gray-400">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
