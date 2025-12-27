const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paginationValidation, mongoIdValidation } = require('../utils/validators');
const { paginate, getPaginationMeta, formatError, formatSuccess } = require('../utils/helpers');
const chatService = require('../services/chatService');
const logger = require('../utils/logger');

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations
 * @access  Private (Agent/Admin)
 */
router.get('/', authenticate, paginationValidation, validate, async (req, res) => {
  try {
    const { page = 1, limit = 30, status, assignedTo, department } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    // Build query
    const query = {};
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (department) query.department = department;

    // For agents, only show assigned conversations
    if (req.user.role === 'agent') {
      query.assignedTo = req.user._id;
    }

    const total = await Conversation.countDocuments(query);
    const conversations = await Conversation.find(query)
      .populate('visitor', 'name email visitorId')
      .populate('assignedTo', 'name email avatar')
      .populate('department', 'name')
      .populate('tags', 'name color')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const meta = getPaginationMeta(total, parseInt(page), limitNum);

    res.json(formatSuccess('Conversations retrieved', { conversations, meta }));
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json(formatError('Error retrieving conversations'));
  }
});

/**
 * @route   GET /api/conversations/:id
 * @desc    Get conversation by ID
 * @access  Private
 */
router.get('/:id', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('visitor')
      .populate('assignedTo', 'name email avatar status')
      .populate('department', 'name')
      .populate('tags', 'name color');

    if (!conversation) {
      return res.status(404).json(formatError('Conversation not found'));
    }

    res.json(formatSuccess('Conversation retrieved', conversation));
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json(formatError('Error retrieving conversation'));
  }
});

/**
 * @route   POST /api/conversations/:id/assign
 * @desc    Assign conversation to agent
 * @access  Private (Agent/Admin)
 */
router.post('/:id/assign', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json(formatError('Agent ID required'));
    }

    const conversation = await chatService.assignConversation(req.params.id, agentId);
    res.json(formatSuccess('Conversation assigned', conversation));
  } catch (error) {
    logger.error('Assign conversation error:', error);
    res.status(500).json(formatError('Error assigning conversation'));
  }
});

/**
 * @route   POST /api/conversations/:id/transfer
 * @desc    Transfer conversation to another agent
 * @access  Private (Agent/Admin)
 */
router.post('/:id/transfer', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { toAgentId, reason } = req.body;

    if (!toAgentId) {
      return res.status(400).json(formatError('Target agent ID required'));
    }

    const conversation = await chatService.transferConversation(
      req.params.id,
      req.user._id,
      toAgentId,
      reason
    );

    res.json(formatSuccess('Conversation transferred', conversation));
  } catch (error) {
    logger.error('Transfer conversation error:', error);
    res.status(500).json(formatError('Error transferring conversation'));
  }
});

/**
 * @route   PUT /api/conversations/:id/status
 * @desc    Update conversation status
 * @access  Private (Agent/Admin)
 */
router.put('/:id/status', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json(formatError('Status required'));
    }

    let conversation;
    if (status === 'resolved') {
      conversation = await chatService.resolveConversation(req.params.id);
    } else if (status === 'closed') {
      conversation = await chatService.closeConversation(req.params.id);
    } else {
      conversation = await Conversation.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
    }

    res.json(formatSuccess('Status updated', conversation));
  } catch (error) {
    logger.error('Update status error:', error);
    res.status(500).json(formatError('Error updating status'));
  }
});

/**
 * @route   POST /api/conversations/:id/rating
 * @desc    Rate conversation
 * @access  Public (with conversation token)
 */
router.post('/:id/rating', mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { score, feedback } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json(formatError('Valid rating score (1-5) required'));
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json(formatError('Conversation not found'));
    }

    conversation.rating = {
      score,
      feedback: feedback || '',
      ratedAt: new Date(),
    };
    await conversation.save();

    res.json(formatSuccess('Rating submitted', conversation.rating));
  } catch (error) {
    logger.error('Rate conversation error:', error);
    res.status(500).json(formatError('Error submitting rating'));
  }
});

/**
 * @route   POST /api/conversations/:id/notes
 * @desc    Add note to conversation
 * @access  Private (Agent/Admin)
 */
router.post('/:id/notes', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { content, isInternal = true } = req.body;

    if (!content) {
      return res.status(400).json(formatError('Note content required'));
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json(formatError('Conversation not found'));
    }

    conversation.notes.push({
      content,
      addedBy: req.user._id,
      isInternal,
      createdAt: new Date(),
    });
    await conversation.save();

    res.json(formatSuccess('Note added', conversation.notes));
  } catch (error) {
    logger.error('Add note error:', error);
    res.status(500).json(formatError('Error adding note'));
  }
});

module.exports = router;
