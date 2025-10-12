const mongoose = require('mongoose');

/**
 * Message Schema
 * Direct messaging between users
 */
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    // For grouping messages into conversations
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for conversation queries
messageSchema.index({ conversationId: 1, createdAt: -1 });

// Index for unread message queries
messageSchema.index({ recipient: 1, read: 1 });

// Static method to generate conversation ID
messageSchema.statics.getConversationId = function (userId1, userId2) {
  // Sort IDs to ensure consistent conversation ID regardless of sender/recipient order
  return [userId1, userId2].sort().join('_');
};

module.exports = mongoose.model('Message', messageSchema);
