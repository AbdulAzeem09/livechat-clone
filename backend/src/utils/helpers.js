const crypto = require('crypto');

/**
 * Generate a random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate visitor ID
 */
const generateVisitorId = () => {
  return `visitor_${Date.now()}_${generateRandomString(8)}`;
};

/**
 * Generate conversation ID
 */
const generateConversationId = () => {
  return `conv_${Date.now()}_${generateRandomString(8)}`;
};

/**
 * Paginate results
 */
const paginate = (page = 1, limit = 30) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;
  
  return {
    skip,
    limit: limitNum,
    page: pageNum,
  };
};

/**
 * Calculate pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Format error response
 */
const formatError = (message, errors = null) => {
  return {
    success: false,
    message,
    errors,
  };
};

/**
 * Format success response
 */
const formatSuccess = (message, data = null) => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Get time ago string
 */
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Extract domain from URL
 */
const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    return null;
  }
};

/**
 * Check if business hours
 */
const isWithinBusinessHours = (businessHours) => {
  if (!businessHours || !businessHours.enabled) return true;
  
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const daySchedule = businessHours.schedule[day];
  if (!daySchedule || !daySchedule.enabled) return false;
  
  const [startHour, startMin] = daySchedule.start.split(':').map(Number);
  const [endHour, endMin] = daySchedule.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  return currentTime >= startTime && currentTime <= endTime;
};

/**
 * Calculate response time in minutes
 */
const calculateResponseTime = (startTime, endTime) => {
  const diff = new Date(endTime) - new Date(startTime);
  return Math.floor(diff / 1000 / 60); // in minutes
};

/**
 * Mask sensitive data
 */
const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

const maskPhone = (phone) => {
  return '***-***-' + phone.slice(-4);
};

module.exports = {
  generateRandomString,
  generateVisitorId,
  generateConversationId,
  paginate,
  getPaginationMeta,
  formatError,
  formatSuccess,
  timeAgo,
  sanitizeInput,
  extractDomain,
  isWithinBusinessHours,
  calculateResponseTime,
  maskEmail,
  maskPhone,
};
