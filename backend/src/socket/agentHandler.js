const { SOCKET_EVENTS, AGENT_STATUS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Agent-specific event handlers
 */
module.exports = (socket, io) => {
  if (socket.userType !== 'agent') return;

  /**
   * Change agent status
   */
  socket.on(SOCKET_EVENTS.AGENT_STATUS_CHANGE, async (data) => {
    try {
      const { status } = data;

      if (!Object.values(AGENT_STATUS).includes(status)) {
        return socket.emit('error', { message: 'Invalid status' });
      }

      socket.user.status = status;
      socket.user.lastActive = new Date();
      await socket.user.save();

      // Broadcast status change
      io.emit(SOCKET_EVENTS.AGENT_STATUS_CHANGE, {
        agentId: socket.user._id,
        name: socket.user.name,
        status,
      });

      logger.info(`Agent ${socket.user.name} status changed to ${status}`);
    } catch (error) {
      logger.error('Agent status change error:', error);
      socket.emit('error', { message: 'Failed to change status' });
    }
  });

  /**
   * Agent joined
   */
  socket.on('agent:join', async (data) => {
    try {
      const { conversationId } = data;

      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
        logger.info(`Agent ${socket.user.name} joined conversation ${conversationId}`);
      }
    } catch (error) {
      logger.error('Agent join error:', error);
    }
  });

  /**
   * Agent left conversation
   */
  socket.on('agent:leave', async (data) => {
    try {
      const { conversationId } = data;

      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
        logger.info(`Agent ${socket.user.name} left conversation ${conversationId}`);
      }
    } catch (error) {
      logger.error('Agent leave error:', error);
    }
  });
};
