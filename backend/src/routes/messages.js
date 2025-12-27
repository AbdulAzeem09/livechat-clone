const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticate } = require('../middleware/auth');
const { messageLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');
const { sendMessageValidation, paginationValidation, mongoIdValidation } = require('../utils/validators');
const { paginate, getPaginationMeta, formatError, formatSuccess } = require('../utils/helpers');
const chatService = require('../services/chatService');
const logger = require('../utils/logger');

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get messages for a conversation
 * @access  Private
 */
router.get('/:conversationId', authenticate, mongoIdValidation('conversationId'), paginationValidation, validate, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const messages = await chatService.getMessages(req.params.conversationId, page, limit);

    res.json(formatSuccess('Messages retrieved', messages));
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json(formatError('Error retrieving messages'));
  }
});

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/', authenticate, messageLimiter, sendMessageValidation, validate, async (req, res) => {
  try {
    const { conversationId, content, type = 'text', replyTo } = req.body;

    const senderData = {
      type: 'agent',
      id: req.user._id,
      name: req.user.name,
    };

    const message = await chatService.sendMessage(conversationId, senderData, content, type);

    if (replyTo) {
      message.replyTo = replyTo;
      await message.save();
    }

    res.status(201).json(formatSuccess('Message sent', message));
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json(formatError('Error sending message'));
  }
});

/**
 * @route   PUT /api/messages/:id
 * @desc    Edit a message
 * @access  Private
 */
router.put('/:id', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json(formatError('Content required'));
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json(formatError('Message not found'));
    }

    // Check ownership
    if (message.sender.id.toString() !== req.user._id.toString()) {
      return res.status(403).json(formatError('Not authorized'));
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.json(formatSuccess('Message updated', message));
  } catch (error) {
    logger.error('Edit message error:', error);
    res.status(500).json(formatError('Error editing message'));
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a message (soft delete)
 * @access  Private
 */
router.delete('/:id', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json(formatError('Message not found'));
    }

    // Check ownership
    if (message.sender.id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json(formatError('Not authorized'));
    }

    await message.softDelete();

    res.json(formatSuccess('Message deleted'));
  } catch (error) {
    logger.error('Delete message error:', error);
    res.status(500).json(formatError('Error deleting message'));
  }
});

/**
 * @route   POST /api/messages/:id/reaction
 * @desc    Add reaction to message
 * @access  Private
 */
router.post('/:id/reaction', authenticate, mongoIdValidation('id'), validate, async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json(formatError('Emoji required'));
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json(formatError('Message not found'));
    }

    await message.addReaction(emoji, req.user._id);

    res.json(formatSuccess('Reaction added', message.reactions));
  } catch (error) {
    logger.error('Add reaction error:', error);
    res.status(500).json(formatError('Error adding reaction'));
  }
});

/**
 * @route   POST /api/messages/read/:conversationId
 * @desc    Mark messages as read
 * @access  Private
 */
router.post('/read/:conversationId', authenticate, mongoIdValidation('conversationId'), validate, async (req, res) => {
  try {
    const count = await chatService.markAsRead(req.params.conversationId, 'agent');

    res.json(formatSuccess('Messages marked as read', { count }));
  } catch (error) {
    logger.error('Mark as read error:', error);
    res.status(500).json(formatError('Error marking messages as read'));
  }
});

module.exports = router;
