const mongoose = require('mongoose');

/**
 * Follow Schema
 * Tracks follower/following relationships between users
 */
const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate follows and optimize queries
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Index for efficient "who does this user follow" queries
followSchema.index({ follower: 1, createdAt: -1 });

// Index for efficient "who follows this user" queries
followSchema.index({ following: 1, createdAt: -1 });

module.exports = mongoose.model('Follow', followSchema);
