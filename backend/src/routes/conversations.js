const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations with filters
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const conversations = await Conversation.find(query)
      .populate('visitor', 'name email sessionId isOnline')
      .populate('assignedAgent', 'name email status')
      .sort({ lastMessageAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Conversation.countDocuments(query);

    res.json({
      conversations,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/conversations/:id
 * @desc    Get single conversation
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('visitor')
      .populate('assignedAgent', 'name email status avatar');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/conversations/:id/assign
 * @desc    Assign conversation to agent
 * @access  Private
 */
router.put('/:id/assign', protect, async (req, res) => {
  try {
    const { agentId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { 
        assignedAgent: agentId || req.user._id,
        status: 'active',
      },
      { new: true }
    ).populate('visitor').populate('assignedAgent', 'name email status');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/conversations/:id/transfer
 * @desc    Transfer conversation to another agent
 * @access  Private
 */
router.put('/:id/transfer', protect, async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId },
      { new: true }
    ).populate('visitor').populate('assignedAgent', 'name email status');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/conversations/:id/resolve
 * @desc    Mark conversation as resolved
 * @access  Private
 */
router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    ).populate('visitor').populate('assignedAgent', 'name email status');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/conversations/:id/close
 * @desc    Close conversation
 * @access  Private
 */
router.put('/:id/close', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'closed',
        closedAt: new Date(),
      },
      { new: true }
    ).populate('visitor').populate('assignedAgent', 'name email status');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/conversations/:id/rate
 * @desc    Rate conversation
 * @access  Public
 */
router.put('/:id/rate', async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { 
        rating,
        ratingComment: comment || '',
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
