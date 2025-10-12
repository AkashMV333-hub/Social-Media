const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments,
  deleteComment,
  likeComment,
  unlikeComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { validateComment } = require('../middleware/validation');

// Comment routes (nested under tweets)
// Note: Create and get comments are handled in tweetRoutes as /api/tweets/:id/comment(s)
// These routes are for direct comment operations

router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);
router.delete('/:id/like', protect, unlikeComment);

module.exports = router;
