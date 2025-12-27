const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/analytics/overview
 * @desc    Get analytics overview
 * @access  Private
 */
router.get('/overview', protect, async (req, res) => {
  try {
    const totalConversations = await Conversation.countDocuments();
    const activeChats = await Conversation.countDocuments({ status: 'active' });
    const pendingChats = await Conversation.countDocuments({ status: 'pending' });
    const resolvedChats = await Conversation.countDocuments({ status: 'resolved' });
    
    // Calculate average response time (mock data for now)
    const avgResponseTime = '2m 30s';
    
    // Calculate customer satisfaction
    const ratedConversations = await Conversation.find({ rating: { $ne: null } });
    const avgRating = ratedConversations.length > 0
      ? ratedConversations.reduce((sum, conv) => sum + conv.rating, 0) / ratedConversations.length
      : 0;

    res.json({
      totalConversations,
      activeChats,
      pendingChats,
      resolvedChats,
      avgResponseTime,
      avgRating: avgRating.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/analytics/charts
 * @desc    Get data for charts
 * @access  Private
 */
router.get('/charts', protect, async (req, res) => {
  try {
    const { period = '7days' } = req.query;
    
    let daysAgo = 7;
    if (period === '30days') daysAgo = 30;
    if (period === '90days') daysAgo = 90;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get conversations per day
    const conversations = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get messages per day
    const messages = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      conversations,
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/analytics/agents
 * @desc    Get agent performance data
 * @access  Private
 */
router.get('/agents', protect, async (req, res) => {
  try {
    const agents = await User.find({ role: { $in: ['agent', 'admin'] } });
    
    const agentStats = await Promise.all(
      agents.map(async (agent) => {
        const assignedConversations = await Conversation.countDocuments({
          assignedAgent: agent._id,
        });
        const resolvedConversations = await Conversation.countDocuments({
          assignedAgent: agent._id,
          status: 'resolved',
        });
        
        return {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          status: agent.status,
          assignedConversations,
          resolvedConversations,
        };
      })
    );

    res.json(agentStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
