const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const analyticsService = require('../services/analyticsService');
const { formatError, formatSuccess } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await analyticsService.getDashboardStats(startDate, endDate);
    
    res.json(formatSuccess('Dashboard stats retrieved', stats));
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json(formatError('Error retrieving dashboard stats'));
  }
});

/**
 * @route   GET /api/analytics/conversations
 * @desc    Get conversation analytics
 * @access  Private
 */
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json(formatError('Start date and end date required'));
    }
    
    const stats = await analyticsService.getConversationsByStatus(startDate, endDate);
    
    res.json(formatSuccess('Conversation analytics retrieved', stats));
  } catch (error) {
    logger.error('Conversation analytics error:', error);
    res.status(500).json(formatError('Error retrieving conversation analytics'));
  }
});

/**
 * @route   GET /api/analytics/conversations-over-time
 * @desc    Get conversations over time
 * @access  Private
 */
router.get('/conversations-over-time', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, interval = 'day' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json(formatError('Start date and end date required'));
    }
    
    const stats = await analyticsService.getConversationsOverTime(startDate, endDate, interval);
    
    res.json(formatSuccess('Conversations over time retrieved', stats));
  } catch (error) {
    logger.error('Conversations over time error:', error);
    res.status(500).json(formatError('Error retrieving data'));
  }
});

/**
 * @route   GET /api/analytics/agent-performance
 * @desc    Get agent performance metrics
 * @access  Private
 */
router.get('/agent-performance', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json(formatError('Start date and end date required'));
    }
    
    const stats = await analyticsService.getAgentPerformance(startDate, endDate);
    
    res.json(formatSuccess('Agent performance retrieved', stats));
  } catch (error) {
    logger.error('Agent performance error:', error);
    res.status(500).json(formatError('Error retrieving agent performance'));
  }
});

/**
 * @route   GET /api/analytics/rating-distribution
 * @desc    Get rating distribution
 * @access  Private
 */
router.get('/rating-distribution', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json(formatError('Start date and end date required'));
    }
    
    const stats = await analyticsService.getRatingDistribution(startDate, endDate);
    
    res.json(formatSuccess('Rating distribution retrieved', stats));
  } catch (error) {
    logger.error('Rating distribution error:', error);
    res.status(500).json(formatError('Error retrieving rating distribution'));
  }
});

/**
 * @route   GET /api/analytics/export-csv
 * @desc    Export data to CSV
 * @access  Private
 */
router.get('/export-csv', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json(formatError('Start date and end date required'));
    }
    
    const data = await analyticsService.exportToCSV(startDate, endDate);
    
    res.json(formatSuccess('Export data retrieved', data));
  } catch (error) {
    logger.error('Export CSV error:', error);
    res.status(500).json(formatError('Error exporting data'));
  }
});

module.exports = router;
