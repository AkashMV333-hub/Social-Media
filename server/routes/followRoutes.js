const express = require('express');
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowStatus,
} = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

// All follow routes require authentication
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);
router.get('/:id/follow/status', protect, getFollowStatus);

module.exports = router;
