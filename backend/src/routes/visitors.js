const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const Conversation = require('../models/Conversation');
const { authenticate } = require('../middleware/auth');
const { formatError, formatSuccess, paginate, getPaginationMeta } = require('../utils/helpers');
const { getGeoLocation, getIpAddress } = require('../utils/geoip');
const logger = require('../utils/logger');

/**
 * @route   GET /api/visitors
 * @desc    Get all visitors
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 30, search } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { visitorId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Visitor.countDocuments(query);
    const visitors = await Visitor.find(query)
      .populate('tags', 'name color')
      .sort({ lastSeen: -1 })
      .skip(skip)
      .limit(limitNum);

    const meta = getPaginationMeta(total, parseInt(page), limitNum);

    res.json(formatSuccess('Visitors retrieved', { visitors, meta }));
  } catch (error) {
    logger.error('Get visitors error:', error);
    res.status(500).json(formatError('Error retrieving visitors'));
  }
});

/**
 * @route   GET /api/visitors/:id
 * @desc    Get visitor by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate('tags', 'name color');

    if (!visitor) {
      return res.status(404).json(formatError('Visitor not found'));
    }

    // Get conversation history
    const conversations = await Conversation.find({ visitor: visitor._id })
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(formatSuccess('Visitor retrieved', { visitor, conversations }));
  } catch (error) {
    logger.error('Get visitor error:', error);
    res.status(500).json(formatError('Error retrieving visitor'));
  }
});

/**
 * @route   POST /api/visitors/track
 * @desc    Track visitor (for widget)
 * @access  Public
 */
router.post('/track', async (req, res) => {
  try {
    const { visitorId, name, email, phone, pageUrl, pageTitle, userAgent, customAttributes } = req.body;
    const ipAddress = getIpAddress(req);
    const location = getGeoLocation(ipAddress);

    let visitor = await Visitor.findOne({ visitorId });

    if (visitor) {
      // Update existing visitor
      if (name) visitor.name = name;
      if (email) visitor.email = email;
      if (phone) visitor.phone = phone;
      if (pageUrl) {
        visitor.currentPage = { url: pageUrl, title: pageTitle };
      }
      if (customAttributes) {
        Object.entries(customAttributes).forEach(([key, value]) => {
          visitor.customAttributes.set(key, value);
        });
      }
      visitor.visitCount += 1;
      await visitor.updateLastSeen();
    } else {
      // Create new visitor
      visitor = await Visitor.create({
        visitorId,
        name: name || '',
        email: email || '',
        phone: phone || '',
        ipAddress,
        location,
        currentPage: { url: pageUrl, title: pageTitle },
        landingPage: pageUrl,
        customAttributes: customAttributes || {},
      });
    }

    res.json(formatSuccess('Visitor tracked', visitor));
  } catch (error) {
    logger.error('Track visitor error:', error);
    res.status(500).json(formatError('Error tracking visitor'));
  }
});

/**
 * @route   POST /api/visitors/:id/notes
 * @desc    Add note to visitor
 * @access  Private
 */
router.post('/:id/notes', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json(formatError('Note content required'));
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json(formatError('Visitor not found'));
    }

    visitor.notes.push({
      content,
      addedBy: req.user._id,
      createdAt: new Date(),
    });
    await visitor.save();

    res.json(formatSuccess('Note added', visitor.notes));
  } catch (error) {
    logger.error('Add visitor note error:', error);
    res.status(500).json(formatError('Error adding note'));
  }
});

/**
 * @route   PUT /api/visitors/:id/ban
 * @desc    Ban/unban visitor
 * @access  Private (Admin)
 */
router.put('/:id/ban', authenticate, async (req, res) => {
  try {
    const { isBanned } = req.body;

    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { isBanned },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json(formatError('Visitor not found'));
    }

    res.json(formatSuccess(isBanned ? 'Visitor banned' : 'Visitor unbanned', visitor));
  } catch (error) {
    logger.error('Ban visitor error:', error);
    res.status(500).json(formatError('Error updating visitor'));
  }
});

module.exports = router;
