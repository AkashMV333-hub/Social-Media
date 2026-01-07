const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Core user model with authentication and Aadhaar identity verification
 */
const userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    
    // Password reset fields
    passwordResetToken: String,
    passwordResetExpires: Date,

    // ✅ Aadhaar fields (new additions)
    aadhaarIdentifier: {
      type: String, // sha256(name|dob|careof)
      unique: true,
      sparse: true, // allows null for users not verified yet
    },
    aadhaarVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    careOf: {
      type: String,
      default: '',
    },

    profilePicture: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    coverPhoto: {
      type: String,
      default: 'https://via.placeholder.com/600x200',
    },
    bio: {
      type: String,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
      default: '',
    },
    location: {
      type: String,
      maxlength: [30, 'Location cannot exceed 30 characters'],
      default: '',
    },
    website: {
      type: String,
      maxlength: [100, 'Website URL cannot exceed 100 characters'],
      default: '',
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    tweetsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
userSchema.index({ name: 'text', username: 'text' });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (exclude sensitive data)
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.aadhaarIdentifier;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);