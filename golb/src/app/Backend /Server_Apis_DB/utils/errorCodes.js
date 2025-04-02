// errorCodes.js

module.exports = {
    // General errors
    INTERNAL_SERVER_ERROR: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    },
  
    // Auth errors
    INVALID_TOKEN: {
      code: "INVALID_TOKEN",
      message: "Token is invalid or expired."
    },
    USER_NOT_FOUND: {
      code: "USER_NOT_FOUND",
      message: "User not found."
    },
    EMAIL_ALREADY_EXISTS: {
      code: "EMAIL_ALREADY_EXISTS",
      message: "Email is already registered."
    },
  
    // Validation
    MISSING_FIELDS: {
      code: "MISSING_FIELDS",
      message: "Required fields are missing."
    },
  
    // Posts
    POST_NOT_FOUND: {
      code: "POST_NOT_FOUND",
      message: "Post not found."
    },
  
    // Comments
    COMMENT_NOT_FOUND: {
      code: "COMMENT_NOT_FOUND",
      message: "Comment not found."
    },
    UNAUTHORIZED_COMMENT_EDIT: {
      code: "UNAUTHORIZED_COMMENT_EDIT",
      message: "You are not allowed to edit this comment."
    },
  
    // Likes & Follows
    ALREADY_LIKED: {
      code: "ALREADY_LIKED",
      message: "You have already liked this post."
    },
    NOT_FOLLOWING: {
      code: "NOT_FOLLOWING",
      message: "You are not following this user."
    }
  };
  