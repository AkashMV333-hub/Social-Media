const Follow = require('../models/Follow');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @desc    Follow a user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
const followUser = async (req, res, next) => {
  try {
    const { id } = req.params; // User ID to follow

    // Validate user can't follow themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself',
      });
    }

    // Check if target user exists
    const userToFollow = await User.findById(id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: id,
    });

    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: 'You are already following this user',
      });
    }

    // Create follow relationship
    await Follow.create({
      follower: req.user._id,
      following: id,
    });

    // Update follower and following counts
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { followingCount: 1 },
    });

    await User.findByIdAndUpdate(id, {
      $inc: { followersCount: 1 },
    });

    // Create notification
    await Notification.create({
      recipient: id,
      sender: req.user._id,
      type: 'follow',
      message: `${req.user.name} started following you`,
    });

    res.status(200).json({
      success: true,
      message: 'User followed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unfollow a user
 * @route   DELETE /api/users/:id/follow
 * @access  Private
 */
const unfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params; // User ID to unfollow

    // Check if following exists
    const followRecord = await Follow.findOne({
      follower: req.user._id,
      following: id,
    });

    if (!followRecord) {
      return res.status(400).json({
        success: false,
        message: 'You are not following this user',
      });
    }

    // Remove follow relationship
    await followRecord.deleteOne();

    // Update follower and following counts
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(id, {
      $inc: { followersCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if current user follows a specific user
 * @route   GET /api/users/:id/follow/status
 * @access  Private
 */
const getFollowStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const followRecord = await Follow.findOne({
      follower: req.user._id,
      following: id,
    });

    res.status(200).json({
      success: true,
      data: {
        isFollowing: !!followRecord,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowStatus,
};
