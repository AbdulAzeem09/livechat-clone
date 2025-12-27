const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/messages/:conversationId
 * @desc    Get messages for a conversation
 * @access  Private
 */
router.get('/:conversationId', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('senderId', 'name email')
      .sort({ createdAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Message.countDocuments({ conversation: req.params.conversationId });

    res.json({
      messages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/messages
 * @desc    Send a message
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { conversationId, content, type = 'text' } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: 'agent',
      senderModel: 'User',
      senderId: req.user._id,
      content,
      type,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/messages/:id/read
 * @desc    Mark message as read
 * @access  Private
 */
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/messages/conversation/:conversationId/read-all
 * @desc    Mark all messages in a conversation as read
 * @access  Private
 */
router.put('/conversation/:conversationId/read-all', protect, async (req, res) => {
  try {
    await Message.updateMany(
      { 
        conversation: req.params.conversationId,
        sender: 'visitor',
        isRead: false,
      },
      { 
        isRead: true,
        readAt: new Date(),
      }
    );

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/messages/:id/react
 * @desc    Add reaction to message
 * @access  Private
 */
router.post('/:id/react', protect, async (req, res) => {
  try {
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      r => r.user.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if already exists
      message.reactions = message.reactions.filter(
        r => !(r.user.toString() === req.user._id.toString() && r.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({
        emoji,
        user: req.user._id,
        userModel: 'User',
      });
    }

    await message.save();
    await message.populate('reactions.user', 'name');
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/messages/:id/edit
 * @desc    Edit message content
 * @access  Private
 */
router.put('/:id/edit', protect, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user owns the message
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    // Add current content to edit history
    message.editHistory.push({
      content: message.content,
      editedAt: new Date(),
    });

    // Update message
    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();
    await message.populate('senderId', 'name email');
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete message (soft delete)
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user owns the message or is admin
    if (
      message.senderId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'super_admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = '[Message deleted]';

    await message.save();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
