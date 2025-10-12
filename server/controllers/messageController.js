const Message = require('../models/Message');
const User = require('../models/User');

/**
 * @desc    Send a message
 * @route   POST /api/messages
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, text } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Can't message yourself
    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send messages to yourself',
      });
    }

    // Generate conversation ID
    const conversationId = Message.getConversationId(req.user._id, recipientId);

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      recipient: recipientId,
      text,
      conversationId,
    });

    // Populate sender data
    await message.populate('sender', 'name username profilePicture');
    await message.populate('recipient', 'name username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get conversation with a user
 * @route   GET /api/messages/conversation/:userId
 * @access  Private
 */
const getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Generate conversation ID
    const conversationId = Message.getConversationId(req.user._id, userId);

    // Get messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) // Oldest first for chat display
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('sender', 'name username profilePicture')
      .populate('recipient', 'name username profilePicture');

    const total = await Message.countDocuments({ conversationId });

    // Mark received messages as read
    await Message.updateMany(
      {
        conversationId,
        recipient: req.user._id,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      data: {
        messages,
        conversation: {
          user,
          conversationId,
        },
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: skip + messages.length < total,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all conversations for current user
 * @route   GET /api/messages/conversations
 * @access  Private
 */
const getConversations = async (req, res, next) => {
  try {
    // Get all messages where user is sender or recipient
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { recipient: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$recipient', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate user data for each conversation
    await Message.populate(messages, {
      path: 'lastMessage.sender lastMessage.recipient',
      select: 'name username profilePicture',
    });

    // Format conversations with other user's info
    const conversations = messages.map(conv => {
      const lastMsg = conv.lastMessage;
      const otherUser = lastMsg.sender._id.toString() === req.user._id.toString()
        ? lastMsg.recipient
        : lastMsg.sender;

      return {
        conversationId: conv._id,
        otherUser,
        lastMessage: lastMsg,
        unreadCount: conv.unreadCount,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        conversations,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message',
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get unread message count
 * @route   GET /api/messages/unread-count
 * @access  Private
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  deleteMessage,
  getUnreadCount,
};
