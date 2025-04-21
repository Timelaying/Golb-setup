// controllers/likes.controller.js
const {
    hasUserLikedPost,
    getLikesCount,
    likePost,
    unlikePost,
  } = require("../models/likes.model");
  
  const errorCodes = require("../utils/errorCodes");
  
  exports.like = async (req, res) => {
    const { userId, postId } = req.body;
  
    const alreadyLiked = await hasUserLikedPost(userId, postId);
    if (alreadyLiked) {
      return res.status(400).json(errorCodes.ALREADY_LIKED);
    }
  
    await likePost(userId, postId);
    const likes = await getLikesCount(postId);
    res.status(200).json({ likes });
  };
  
  exports.unlike = async (req, res) => {
    const { userId, postId } = req.body;
  
    await unlikePost(userId, postId);
    const likes = await getLikesCount(postId);
    res.status(200).json({ likes });
  };
  
  exports.getLikes = async (req, res) => {
    const { postId } = req.params;
  
    const likes = await getLikesCount(postId);
    res.status(200).json({ likes });
  };
  
  exports.checkUserLike = async (req, res) => {
    const { userId, postId } = req.params;
  
    const liked = await hasUserLikedPost(userId, postId);
    res.status(200).json({ liked });
  };
  