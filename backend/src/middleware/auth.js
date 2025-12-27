const jwt = require('jsonwebtoken');
const { formatError } = require('../utils/helpers');
const User = require('../models/User');

/**
 * Authenticate JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json(formatError('Not authorized, no token provided'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json(formatError('User not found'));
      }

      if (!user.isActive) {
        return res.status(401).json(formatError('User account is deactivated'));
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json(formatError('Token expired'));
      }
      return res.status(401).json(formatError('Not authorized, invalid token'));
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json(formatError('Server error'));
  }
};

/**
 * Check if user has specific role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(formatError('Not authorized'));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(formatError('Not authorized to access this resource'));
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Ignore errors for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
