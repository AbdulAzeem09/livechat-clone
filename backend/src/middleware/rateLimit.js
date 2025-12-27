const rateLimit = require('express-rate-limit');
const { formatError } = require('../utils/helpers');

/**
 * General rate limiter
 */
const limiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: formatError('Too many requests, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict rate limiter for auth endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  message: formatError('Too many authentication attempts, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for message sending
 */
const messageLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: formatError('Too many messages, please slow down'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit per user or IP
    return req.user?.id || req.ip;
  },
});

/**
 * Rate limiter for file uploads
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: formatError('Too many file uploads, please try again later'),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
  authLimiter,
  messageLimiter,
  uploadLimiter,
};
