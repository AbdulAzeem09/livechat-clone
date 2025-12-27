const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { authLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../utils/validators');
const { formatError, formatSuccess } = require('../utils/helpers');
const { getIpAddress } = require('../utils/geoip');
const logger = require('../utils/logger');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public (but can be restricted)
 */
router.post('/register', authLimiter, registerValidation, validate, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(formatError('User already exists with this email'));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'agent',
    });

    // Log audit
    await AuditLog.log({
      action: 'user.created',
      userId: user._id,
      resourceType: 'user',
      resourceId: user._id,
      details: { email, role: user.role },
      ipAddress: getIpAddress(req),
      userAgent: req.headers['user-agent'],
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(formatSuccess('User registered successfully', {
      user: userResponse,
      token,
      refreshToken,
    }));
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json(formatError('Error registering user'));
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authLimiter, loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      await AuditLog.log({
        action: 'login.failed',
        userId: null,
        resourceType: 'user',
        details: { email, reason: 'User not found' },
        ipAddress: getIpAddress(req),
        userAgent: req.headers['user-agent'],
      });
      return res.status(401).json(formatError('Invalid credentials'));
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json(formatError('Account is deactivated'));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await AuditLog.log({
        action: 'login.failed',
        userId: user._id,
        resourceType: 'user',
        details: { email, reason: 'Invalid password' },
        ipAddress: getIpAddress(req),
        userAgent: req.headers['user-agent'],
      });
      return res.status(401).json(formatError('Invalid credentials'));
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Log audit
    await AuditLog.log({
      action: 'login.success',
      userId: user._id,
      resourceType: 'user',
      details: { email },
      ipAddress: getIpAddress(req),
      userAgent: req.headers['user-agent'],
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(formatSuccess('Login successful', {
      user: userResponse,
      token,
      refreshToken,
    }));
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json(formatError('Error logging in'));
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(formatError('Refresh token required'));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Get user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json(formatError('Invalid refresh token'));
    }

    // Generate new access token
    const token = generateToken(user._id);

    res.json(formatSuccess('Token refreshed', { token }));
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json(formatError('Invalid or expired refresh token'));
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', require('../middleware/auth').authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('departments', 'name')
      .select('-password');

    res.json(formatSuccess('User retrieved', user));
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json(formatError('Error retrieving user'));
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', require('../middleware/auth').authenticate, async (req, res) => {
  try {
    // Update user status to offline
    req.user.status = 'offline';
    req.user.socketId = null;
    await req.user.save();

    // Log audit
    await AuditLog.log({
      action: 'logout',
      userId: req.user._id,
      resourceType: 'user',
      details: {},
      ipAddress: getIpAddress(req),
      userAgent: req.headers['user-agent'],
    });

    res.json(formatSuccess('Logout successful'));
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json(formatError('Error logging out'));
  }
});

module.exports = router;
