const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
  deleteMessage,
  getUnreadCount,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { validateMessage } = require('../middleware/validation');

// All message routes require authentication
router.post('/', protect, validateMessage, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/conversation/:userId', protect, getConversation);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
