const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @desc    Search users by name or username
 * @route   GET /api/search/users?q=query
 * @access  Public
 */
router.get('/users', async (req, res, next) => {
  try {
    const { q, limit = 20, skip = 0 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // Search using text index or regex
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name username profilePicture bio followersCount')
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await User.countDocuments({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + users.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
