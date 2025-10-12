const mongoose = require('mongoose');

/**
 * Tweet Schema
 * Core tweet/post model with text, image, likes, and engagement tracking
 */
const tweetSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: [true, 'Tweet text is required'],
      maxlength: [280, 'Tweet cannot exceed 280 characters'],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    retweetsCount: {
      type: Number,
      default: 0,
    },
    // Original tweet reference (for retweets - future feature)
    originalTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tweet',
      default: null,
    },
    isRetweet: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient feed queries (sorted by creation date)
tweetSchema.index({ createdAt: -1 });
tweetSchema.index({ author: 1, createdAt: -1 });

// Virtual for checking if tweet has media
tweetSchema.virtual('hasMedia').get(function () {
  return !!this.image;
});

module.exports = mongoose.model('Tweet', tweetSchema);
