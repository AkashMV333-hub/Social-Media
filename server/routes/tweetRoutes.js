const express = require('express');
const router = express.Router();
const {
  createTweet,
  getTweetById,
  getHomeFeed,
  getLatestTweets,
  likeTweet,
  unlikeTweet,
  deleteTweet,
} = require('../controllers/tweetController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../middleware/upload');
const { validateTweet } = require('../middleware/validation');

// Tweet CRUD
router.post(
  '/',
  protect,
  upload.single('image'),
  handleMulterError,
  validateTweet,
  createTweet
);
router.get('/feed', protect, getHomeFeed);
router.get('/latest', optionalAuth, getLatestTweets);
router.get('/:id', optionalAuth, getTweetById);
router.delete('/:id', protect, deleteTweet);

// Like/Unlike
router.post('/:id/like', protect, likeTweet);
router.delete('/:id/like', protect, unlikeTweet);

module.exports = router;
