const User = require('../models/User');
const Tweet = require('../models/Tweet');
const Follow = require('../models/Follow');
const { uploadImage } = require('../utils/imageUtils');

/**
 * @desc    Get user profile by username
 * @route   GET /api/users/:username
 * @access  Public
 */
const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if current user follows this profile (if authenticated)
    let isFollowing = false;
    if (req.user) {
      const followRecord = await Follow.findOne({
        follower: req.user._id,
        following: user._id,
      });
      isFollowing = !!followRecord;
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile(),
        isFollowing,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's tweets
 * @route   GET /api/users/:username/tweets
 * @access  Public
 */
const getUserTweets = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { tab = 'tweets', limit = 20, skip = 0 } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let query = { author: user._id };

    // Filter based on tab
    if (tab === 'media') {
      query.image = { $ne: null };
    }
    // For 'tweets' tab, show all tweets
    // For 'replies', would need to check if tweet is a reply (future enhancement)

    const tweets = await Tweet.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('author', 'name username profilePicture');

    const total = await Tweet.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tweets,
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
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, website } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload profile picture
 * @route   POST /api/users/profile-picture
 * @access  Private
 */
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const imageUrl = await uploadImage(req.file, 'twitter-clone/profiles');

    const user = await User.findById(req.user._id);
    user.profilePicture = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profilePicture: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload cover photo
 * @route   POST /api/users/cover-photo
 * @access  Private
 */
const uploadCoverPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const imageUrl = await uploadImage(req.file, 'twitter-clone/covers');

    const user = await User.findById(req.user._id);
    user.coverPhoto = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Cover photo updated successfully',
      data: {
        coverPhoto: imageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's followers
 * @route   GET /api/users/:username/followers
 * @access  Public
 */
const getFollowers = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const followers = await Follow.find({ following: user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('follower', 'name username profilePicture bio');

    const total = await Follow.countDocuments({ following: user._id });

    res.status(200).json({
      success: true,
      data: {
        followers: followers.map(f => f.follower),
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + followers.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's following
 * @route   GET /api/users/:username/following
 * @access  Public
 */
const getFollowing = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const following = await Follow.find({ follower: user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('following', 'name username profilePicture bio');

    const total = await Follow.countDocuments({ follower: user._id });

    res.status(200).json({
      success: true,
      data: {
        following: following.map(f => f.following),
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + following.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  getUserTweets,
  updateProfile,
  uploadProfilePicture,
  uploadCoverPhoto,
  getFollowers,
  getFollowing,
};
