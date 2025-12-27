const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { CONVERSATION_STATUS } = require('../config/constants');

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (startDate = null, endDate = null) => {
  try {
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Active conversations
    const activeConversations = await Conversation.countDocuments({
      status: { $in: [CONVERSATION_STATUS.PENDING, CONVERSATION_STATUS.ACTIVE] },
    });

    // Total conversations
    const totalConversations = await Conversation.countDocuments(dateFilter);

    // Agents online
    const agentsOnline = await User.countDocuments({
      role: 'agent',
      status: { $in: ['online', 'away'] },
      isActive: true,
    });

    // Average rating
    const ratingStats = await Conversation.aggregate([
      {
        $match: {
          'rating.score': { $exists: true, $ne: null },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating.score' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;
    const totalRatings = ratingStats.length > 0 ? ratingStats[0].totalRatings : 0;

    // Response time stats
    const responseTimeStats = await Conversation.aggregate([
      {
        $match: {
          firstResponseAt: { $exists: true, $ne: null },
          ...dateFilter,
        },
      },
      {
        $project: {
          responseTime: {
            $divide: [
              { $subtract: ['$firstResponseAt', '$createdAt'] },
              60000, // Convert to minutes
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' },
        },
      },
    ]);

    const avgResponseTime = responseTimeStats.length > 0 
      ? Math.round(responseTimeStats[0].avgResponseTime) 
      : 0;

    return {
      activeConversations,
      totalConversations,
      agentsOnline,
      avgRating: avgRating ? avgRating.toFixed(2) : 0,
      totalRatings,
      avgResponseTime,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get conversations by status
 */
const getConversationsByStatus = async (startDate, endDate) => {
  try {
    const stats = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats;
  } catch (error) {
    throw error;
  }
};

/**
 * Get conversations over time
 */
const getConversationsOverTime = async (startDate, endDate, interval = 'day') => {
  try {
    const groupByFormat = interval === 'hour' 
      ? { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } }
      : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };

    const stats = await Conversation.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: groupByFormat,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return stats;
  } catch (error) {
    throw error;
  }
};

/**
 * Get agent performance
 */
const getAgentPerformance = async (startDate, endDate) => {
  try {
    const stats = await Conversation.aggregate([
      {
        $match: {
          assignedTo: { $exists: true, $ne: null },
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$assignedTo',
          totalConversations: { $sum: 1 },
          avgRating: { $avg: '$rating.score' },
          resolvedCount: {
            $sum: {
              $cond: [{ $eq: ['$status', CONVERSATION_STATUS.RESOLVED] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agent',
        },
      },
      {
        $unwind: '$agent',
      },
      {
        $project: {
          agentId: '$_id',
          agentName: '$agent.name',
          agentEmail: '$agent.email',
          totalConversations: 1,
          avgRating: { $ifNull: ['$avgRating', 0] },
          resolvedCount: 1,
          resolutionRate: {
            $multiply: [
              { $divide: ['$resolvedCount', '$totalConversations'] },
              100,
            ],
          },
        },
      },
      {
        $sort: { totalConversations: -1 },
      },
    ]);

    return stats;
  } catch (error) {
    throw error;
  }
};

/**
 * Get rating distribution
 */
const getRatingDistribution = async (startDate, endDate) => {
  try {
    const stats = await Conversation.aggregate([
      {
        $match: {
          'rating.score': { $exists: true, $ne: null },
          'rating.ratedAt': { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: '$rating.score',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return stats;
  } catch (error) {
    throw error;
  }
};

/**
 * Export data to CSV format
 */
const exportToCSV = async (startDate, endDate) => {
  try {
    const conversations = await Conversation.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })
      .populate('visitor', 'name email')
      .populate('assignedTo', 'name email')
      .populate('department', 'name')
      .lean();

    // Format data for CSV
    const csvData = conversations.map(conv => ({
      conversationId: conv.conversationId,
      visitorName: conv.visitor?.name || 'Anonymous',
      visitorEmail: conv.visitor?.email || '',
      agentName: conv.assignedTo?.name || 'Unassigned',
      department: conv.department?.name || '',
      status: conv.status,
      priority: conv.priority,
      rating: conv.rating?.score || '',
      createdAt: conv.createdAt,
      resolvedAt: conv.resolvedAt || '',
    }));

    return csvData;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardStats,
  getConversationsByStatus,
  getConversationsOverTime,
  getAgentPerformance,
  getRatingDistribution,
  exportToCSV,
};
