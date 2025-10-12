const Tweet = require('../models/Tweet');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadImage } = require('../utils/imageUtils');

/**
 * @desc    Create a new tweet
 * @route   POST /api/tweets
 * @access  Private
 */
const createTweet = async (req, res, next) => {
  try {
    const { text } = req.body;
    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      imageUrl = await uploadImage(req.file, 'twitter-clone/tweets');
    }

    const tweet = await Tweet.create({
      author: req.user._id,
      text,
      image: imageUrl,
    });

    // Update user's tweet count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tweetsCount: 1 },
    });

    // Populate author data
    await tweet.populate('author', 'name username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Tweet created successfully',
      data: {
        tweet,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get tweet by ID
 * @route   GET /api/tweets/:id
 * @access  Public
 */
const getTweetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id)
      .populate('author', 'name username profilePicture');

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found',
      });
    }

    // Check if current user has liked this tweet
    let isLiked = false;
    if (req.user) {
      isLiked = tweet.likes.includes(req.user._id);
    }

    res.status(200).json({
      success: true,
      data: {
        tweet,
        isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get home feed (tweets from followed users)
 * @route   GET /api/tweets/feed
 * @access  Private
 */
const getHomeFeed = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    // Get list of users the current user follows
    const Follow = require('../models/Follow');
    const followingRecords = await Follow.find({ follower: req.user._id });
    const followingIds = followingRecords.map(f => f.following);

    // Include current user's tweets in the feed
    followingIds.push(req.user._id);

    // Get tweets from followed users
    const tweets = await Tweet.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('author', 'name username profilePicture');

    // Add isLiked flag for each tweet
    const tweetsWithLikeStatus = tweets.map(tweet => ({
      ...tweet.toObject(),
      isLiked: tweet.likes.includes(req.user._id),
    }));

    const total = await Tweet.countDocuments({ author: { $in: followingIds } });

    res.status(200).json({
      success: true,
      data: {
        tweets: tweetsWithLikeStatus,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + tweets.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get latest tweets (global feed)
 * @route   GET /api/tweets/latest
 * @access  Public
 */
const getLatestTweets = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const tweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('author', 'name username profilePicture');

    // Add isLiked flag if user is authenticated
    let tweetsWithLikeStatus = tweets;
    if (req.user) {
      tweetsWithLikeStatus = tweets.map(tweet => ({
        ...tweet.toObject(),
        isLiked: tweet.likes.includes(req.user._id),
      }));
    }

    const total = await Tweet.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        tweets: tweetsWithLikeStatus,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + tweets.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like a tweet
 * @route   POST /api/tweets/:id/like
 * @access  Private
 */
const likeTweet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found',
      });
    }

    // Check if already liked
    if (tweet.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Tweet already liked',
      });
    }

    // Add like
    tweet.likes.push(req.user._id);
    tweet.likesCount += 1;
    await tweet.save();

    // Create notification for tweet author (if not liking own tweet)
    if (tweet.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: tweet.author,
        sender: req.user._id,
        type: 'like',
        tweet: tweet._id,
        message: `${req.user.name} liked your tweet`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Tweet liked successfully',
      data: {
        likesCount: tweet.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unlike a tweet
 * @route   DELETE /api/tweets/:id/like
 * @access  Private
 */
const unlikeTweet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found',
      });
    }

    // Check if not liked
    if (!tweet.likes.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Tweet not liked yet',
      });
    }

    // Remove like
    tweet.likes = tweet.likes.filter(
      userId => userId.toString() !== req.user._id.toString()
    );
    tweet.likesCount -= 1;
    await tweet.save();

    res.status(200).json({
      success: true,
      message: 'Tweet unliked successfully',
      data: {
        likesCount: tweet.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a tweet
 * @route   DELETE /api/tweets/:id
 * @access  Private
 */
const deleteTweet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tweet = await Tweet.findById(id);

    if (!tweet) {
      return res.status(404).json({
        success: false,
        message: 'Tweet not found',
      });
    }

    // Check if user is the author
    if (tweet.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this tweet',
      });
    }

    await tweet.deleteOne();

    // Update user's tweet count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tweetsCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Tweet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTweet,
  getTweetById,
  getHomeFeed,
  getLatestTweets,
  likeTweet,
  unlikeTweet,
  deleteTweet,
};
