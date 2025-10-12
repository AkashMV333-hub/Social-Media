const { body, validationResult } = require('express-validator');

/**
 * Express-validator middleware for input validation
 * Provides reusable validation chains for different endpoints
 */

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Registration validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate,
];

// Tweet validation
const validateTweet = [
  body('text')
    .trim()
    .notEmpty().withMessage('Tweet text is required')
    .isLength({ max: 280 }).withMessage('Tweet cannot exceed 280 characters'),
  validate,
];

// Comment validation
const validateComment = [
  body('text')
    .trim()
    .notEmpty().withMessage('Comment text is required')
    .isLength({ max: 280 }).withMessage('Comment cannot exceed 280 characters'),
  validate,
];

// Message validation
const validateMessage = [
  body('text')
    .trim()
    .notEmpty().withMessage('Message text is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  validate,
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 160 }).withMessage('Bio cannot exceed 160 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 30 }).withMessage('Location cannot exceed 30 characters'),
  body('website')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Website URL cannot exceed 100 characters'),
  validate,
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateTweet,
  validateComment,
  validateMessage,
  validateProfileUpdate,
};
