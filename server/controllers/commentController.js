const Comment = require('../models/Comment');
const Tweet = require('../models/Tweet');
const Notification = require('../models/Notification');

/**
 * @desc    Create a comment on a tweet
 * @route   POST /api/tweets/:id/comment
 * @access  Private
 */
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params; // Tweet ID
    const { text, parentCommentId, parentComment } = req.body;
   

    // Check if tweet exists
    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found',
      });
    }

    // Create comment
    let parent = null;
    if (parentCommentId) {
      parent = await Comment.findById(parentCommentId);
      if (!parent || parent.tweet.toString() !== id) {
        return res.status(400).json({ message: 'Invalid parent comment' });
      }
    }
    const comment = await Comment.create({
      tweet: id,
      author: req.user._id,
      text,
      parentComment: parentComment || parentCommentId || null, // Save the parent comment
    });

    // Update tweet's comment count
    // Only update tweet's comment count for top-level comments (not replies)
if (!parentComment && !parentCommentId) {
  tweet.commentsCount += 1;
  await tweet.save();
}

    // Populate author data
    await comment.populate('author', 'name username profilePicture');

    // Create notification for post author (if not commenting on own post)
    if (tweet.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: tweet.author,
        sender: req.user._id,
        type: 'comment',
        tweet: tweet._id,
        comment: comment._id,
        message: `${req.user.name} commented on your post`,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for a tweet
 * @route   GET /api/tweets/:id/comments
 * @access  Public
 */
const getComments = async (req, res, next) => {
  try {
    const { id } = req.params; // Tweet ID
    const { limit = 20, skip = 0 } = req.query;

    // Check if tweet exists
    const tweet = await Tweet.findById(id);
    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found',
      });
    }

    const comments = await Comment.find({ tweet: id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('author', 'name username profilePicture');

    const total = await Comment.countDocuments({ tweet: id });

    res.status(200).json({
      success: true,
      data: {
        tweetAuthorId: tweet.author,
        comments,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + comments.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params; // Comment ID

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
    }

    // Update tweet's comment count
    // Only update tweet's comment count for top-level comments (not replies)
if (!comment.parentComment) {
  await Tweet.findByIdAndUpdate(comment.tweet, {
    $inc: { commentsCount: -1 },
  });
}

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like a comment
 * @route   POST /api/comments/:id/like
 * @access  Private
 */
const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if already liked
    if (comment.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Comment already liked',
      });
    }

    // Add like
    comment.likes.push(req.user._id);
    comment.likesCount += 1;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment liked successfully',
      data: {
        likesCount: comment.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unlike a comment
 * @route   DELETE /api/comments/:id/like
 * @access  Private
 */
const unlikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if not liked
    if (!comment.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Comment not liked yet',
      });
    }

    // Remove like
    comment.likes = comment.likes.filter(
      userId => userId.toString() !== req.user._id.toString()
    );
    comment.likesCount -= 1;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment unliked successfully',
      data: {
        likesCount: comment.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
  likeComment,
  unlikeComment,
};
