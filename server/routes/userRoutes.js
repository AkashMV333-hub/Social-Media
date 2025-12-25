const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getUserTweets,
  updateProfile,
  uploadProfilePicture,
  uploadCoverPhoto,
  getFollowers,
  getFollowing,
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../middleware/upload');
const { validateProfileUpdate } = require('../middleware/validation');

// Profile routes
router.get('/:username', optionalAuth, getUserProfile);
router.get('/:username/tweets',optionalAuth, getUserTweets);
router.put('/profile', protect, validateProfileUpdate, updateProfile);

// Image upload routes
router.post(
  '/profile-picture',
  protect,
  upload.single('image'),
  handleMulterError,
  uploadProfilePicture
);
router.post(
  '/cover-photo',
  protect,
  upload.single('image'),
  handleMulterError,
  uploadCoverPhoto
);

// Follow routes
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

module.exports = router;
