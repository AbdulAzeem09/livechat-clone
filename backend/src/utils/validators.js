const { body, param, query } = require('express-validator');

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['agent', 'admin', 'super_admin'])
    .withMessage('Invalid role'),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Validation rules for creating a conversation
 */
const createConversationValidation = [
  body('visitorId')
    .notEmpty()
    .withMessage('Visitor ID is required'),
  body('departmentId')
    .optional()
    .isMongoId()
    .withMessage('Invalid department ID'),
];

/**
 * Validation rules for sending a message
 */
const sendMessageValidation = [
  body('conversationId')
    .notEmpty()
    .withMessage('Conversation ID is required')
    .isMongoId()
    .withMessage('Invalid conversation ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Message content is required')
    .isLength({ max: 5000 })
    .withMessage('Message too long'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'file', 'system'])
    .withMessage('Invalid message type'),
];

/**
 * Validation rules for visitor tracking
 */
const visitorTrackingValidation = [
  body('pageUrl')
    .notEmpty()
    .withMessage('Page URL is required')
    .isURL()
    .withMessage('Invalid URL'),
  body('pageTitle')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Page title too long'),
];

/**
 * Validation rules for canned responses
 */
const cannedResponseValidation = [
  body('shortcut')
    .trim()
    .notEmpty()
    .withMessage('Shortcut is required')
    .isLength({ max: 50 })
    .withMessage('Shortcut too long'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message too long'),
];

/**
 * Validation rules for department
 */
const departmentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Department name is required')
    .isLength({ max: 100 })
    .withMessage('Name too long'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description too long'),
];

/**
 * Validation rules for trigger
 */
const triggerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Trigger name is required'),
  body('conditions')
    .isArray({ min: 1 })
    .withMessage('At least one condition is required'),
  body('actions')
    .isArray({ min: 1 })
    .withMessage('At least one action is required'),
];

/**
 * Validation rules for webhook
 */
const webhookValidation = [
  body('url')
    .notEmpty()
    .withMessage('Webhook URL is required')
    .isURL()
    .withMessage('Invalid URL'),
  body('events')
    .isArray({ min: 1 })
    .withMessage('At least one event is required'),
];

/**
 * Validation rules for widget configuration
 */
const widgetConfigValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Widget name is required'),
  body('primaryColor')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Invalid color format'),
  body('position')
    .optional()
    .isIn(['left', 'right'])
    .withMessage('Invalid position'),
];

/**
 * Validation rules for tag
 */
const tagValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tag name is required')
    .isLength({ max: 50 })
    .withMessage('Tag name too long'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Invalid color format'),
];

/**
 * Pagination validation
 */
const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * MongoDB ID validation
 */
const mongoIdValidation = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
];

module.exports = {
  registerValidation,
  loginValidation,
  createConversationValidation,
  sendMessageValidation,
  visitorTrackingValidation,
  cannedResponseValidation,
  departmentValidation,
  triggerValidation,
  webhookValidation,
  widgetConfigValidation,
  tagValidation,
  paginationValidation,
  mongoIdValidation,
};
