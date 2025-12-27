const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Notify about new message
 */
const notifyNewMessage = async (conversation, message) => {
  try {
    // This will be handled by Socket.io in real-time
    // Redis pub/sub can be used for horizontal scaling
    const redisClient = getRedisClient();
    
    if (redisClient) {
      await redisClient.publish('new_message', JSON.stringify({
        conversationId: conversation._id,
        message,
      }));
    }
  } catch (error) {
    logger.error('Error in notifyNewMessage:', error);
  }
};

/**
 * Notify about conversation assignment
 */
const notifyAssignment = async (conversation, agentId) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient) {
      await redisClient.publish('conversation_assigned', JSON.stringify({
        conversationId: conversation._id,
        agentId,
      }));
    }
  } catch (error) {
    logger.error('Error in notifyAssignment:', error);
  }
};

/**
 * Notify about conversation transfer
 */
const notifyTransfer = async (conversation, fromAgentId, toAgentId) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient) {
      await redisClient.publish('conversation_transferred', JSON.stringify({
        conversationId: conversation._id,
        fromAgentId,
        toAgentId,
      }));
    }
  } catch (error) {
    logger.error('Error in notifyTransfer:', error);
  }
};

/**
 * Notify agents about new conversation
 */
const notifyNewConversation = async (conversation) => {
  try {
    const redisClient = getRedisClient();
    
    if (redisClient) {
      await redisClient.publish('new_conversation', JSON.stringify({
        conversationId: conversation._id,
        departmentId: conversation.department,
      }));
    }
  } catch (error) {
    logger.error('Error in notifyNewConversation:', error);
  }
};

/**
 * Send desktop notification
 */
const sendDesktopNotification = (userId, title, body, data = {}) => {
  // This will be handled by Socket.io to send to specific user
  return {
    userId,
    notification: {
      title,
      body,
      data,
    },
  };
};

/**
 * Send email notification (placeholder - will be implemented in emailService)
 */
const sendEmailNotification = async (email, subject, template, data) => {
  try {
    // Placeholder for email notification
    logger.info(`Email notification to ${email}: ${subject}`);
    // TODO: Implement actual email sending
  } catch (error) {
    logger.error('Error sending email notification:', error);
  }
};

module.exports = {
  notifyNewMessage,
  notifyAssignment,
  notifyTransfer,
  notifyNewConversation,
  sendDesktopNotification,
  sendEmailNotification,
};
