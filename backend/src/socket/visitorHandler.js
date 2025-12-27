const { SOCKET_EVENTS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Visitor-specific event handlers
 */
module.exports = (socket, io) => {
  if (socket.userType !== 'visitor') return;

  /**
   * Page view tracking
   */
  socket.on(SOCKET_EVENTS.VISITOR_PAGE_VIEW, async (data) => {
    try {
      const { url, title } = data;

      await socket.visitor.addPageView(url, title);

      // Notify agents about page change
      io.emit(SOCKET_EVENTS.VISITOR_PAGE_VIEW, {
        visitorId: socket.visitor.visitorId,
        url,
        title,
      });

      logger.info(`Visitor ${socket.visitor.visitorId} viewed page: ${url}`);
    } catch (error) {
      logger.error('Page view tracking error:', error);
    }
  });

  /**
   * Update visitor info
   */
  socket.on('visitor:update', async (data) => {
    try {
      const { name, email, phone, customAttributes } = data;

      if (name) socket.visitor.name = name;
      if (email) socket.visitor.email = email;
      if (phone) socket.visitor.phone = phone;
      if (customAttributes) {
        Object.entries(customAttributes).forEach(([key, value]) => {
          socket.visitor.customAttributes.set(key, value);
        });
      }

      await socket.visitor.save();

      logger.info(`Visitor ${socket.visitor.visitorId} info updated`);
    } catch (error) {
      logger.error('Visitor update error:', error);
    }
  });

  /**
   * Visitor joined room
   */
  socket.on('visitor:join', async (data) => {
    try {
      const { conversationId } = data;

      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
        logger.info(`Visitor ${socket.visitor.visitorId} joined conversation ${conversationId}`);
      }
    } catch (error) {
      logger.error('Visitor join error:', error);
    }
  });
};
