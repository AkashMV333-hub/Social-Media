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
const User = require('../models/User');

// Search users for mentions - MUST come before /:username
router.get('/search', protect, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }
    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    })
    .select('username name profilePicture')
    .limit(10);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ success: false, message: 'Error searching users' });
  }
});

// Profile routes - MUST come after /search
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