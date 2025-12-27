const { SOCKET_EVENTS } = require('../config/constants');
const chatService = require('../services/chatService');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');

/**
 * Chat event handlers
 */
module.exports = (socket, io) => {
  /**
   * Send message
   */
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async (data) => {
    try {
      const { conversationId, content, type = 'text', attachments = [] } = data;

      const senderData = socket.userType === 'agent' 
        ? {
            type: 'agent',
            id: socket.user._id,
            name: socket.user.name,
          }
        : {
            type: 'visitor',
            id: socket.visitor._id,
            name: socket.visitor.name || 'Anonymous',
          };

      const message = await chatService.sendMessage(
        conversationId,
        senderData,
        content,
        type,
        attachments
      );

      const conversation = await Conversation.findById(conversationId);

      // Emit to conversation participants
      if (socket.userType === 'visitor' && conversation.assignedTo) {
        // Send to agent
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, message);
      } else if (socket.userType === 'agent') {
        // Send to visitor
        const visitor = await conversation.populate('visitor');
        io.to(`visitor:${visitor.visitor.visitorId}`).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, message);
      }

      // Confirm to sender
      socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, { messageId: message._id });

      logger.info(`Message sent in conversation ${conversationId}`);
    } catch (error) {
      logger.error('Message send error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  /**
   * Typing indicator
   */
  socket.on(SOCKET_EVENTS.TYPING_START, async (data) => {
    try {
      const { conversationId } = data;
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) return;

      if (socket.userType === 'visitor' && conversation.assignedTo) {
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.TYPING_START, {
          conversationId,
          userType: 'visitor',
        });
      } else if (socket.userType === 'agent') {
        const visitor = await conversation.populate('visitor');
        io.to(`visitor:${visitor.visitor.visitorId}`).emit(SOCKET_EVENTS.TYPING_START, {
          conversationId,
          userType: 'agent',
          agentName: socket.user.name,
        });
      }
    } catch (error) {
      logger.error('Typing start error:', error);
    }
  });

  socket.on(SOCKET_EVENTS.TYPING_STOP, async (data) => {
    try {
      const { conversationId } = data;
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) return;

      if (socket.userType === 'visitor' && conversation.assignedTo) {
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.TYPING_STOP, {
          conversationId,
          userType: 'visitor',
        });
      } else if (socket.userType === 'agent') {
        const visitor = await conversation.populate('visitor');
        io.to(`visitor:${visitor.visitor.visitorId}`).emit(SOCKET_EVENTS.TYPING_STOP, {
          conversationId,
          userType: 'agent',
        });
      }
    } catch (error) {
      logger.error('Typing stop error:', error);
    }
  });

  /**
   * Mark message as read
   */
  socket.on(SOCKET_EVENTS.MESSAGE_READ, async (data) => {
    try {
      const { messageId, conversationId } = data;

      const message = await Message.findById(messageId);
      if (message) {
        await message.markAsRead();

        // Notify sender
        io.to(`agent:${message.sender.id}`).emit(SOCKET_EVENTS.MESSAGE_READ, {
          messageId,
          conversationId,
        });
      }
    } catch (error) {
      logger.error('Message read error:', error);
    }
  });

  /**
   * Edit message
   */
  socket.on(SOCKET_EVENTS.MESSAGE_EDIT, async (data) => {
    try {
      const { messageId, content } = data;

      const message = await Message.findById(messageId);
      if (!message) return;

      // Check ownership
      if (message.sender.id.toString() !== (socket.user?._id?.toString() || socket.visitor?._id?.toString())) {
        return socket.emit('error', { message: 'Not authorized' });
      }

      message.content = content;
      message.isEdited = true;
      message.editedAt = new Date();
      await message.save();

      // Broadcast to conversation
      const conversation = await Conversation.findById(message.conversation);
      if (conversation.assignedTo) {
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.MESSAGE_EDIT, message);
      }
      const visitor = await conversation.populate('visitor');
      io.to(`visitor:${visitor.visitor.visitorId}`).emit(SOCKET_EVENTS.MESSAGE_EDIT, message);
    } catch (error) {
      logger.error('Message edit error:', error);
    }
  });

  /**
   * Delete message
   */
  socket.on(SOCKET_EVENTS.MESSAGE_DELETE, async (data) => {
    try {
      const { messageId } = data;

      const message = await Message.findById(messageId);
      if (!message) return;

      // Check ownership
      if (message.sender.id.toString() !== (socket.user?._id?.toString() || socket.visitor?._id?.toString())) {
        return socket.emit('error', { message: 'Not authorized' });
      }

      await message.softDelete();

      // Broadcast to conversation
      const conversation = await Conversation.findById(message.conversation);
      if (conversation.assignedTo) {
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.MESSAGE_DELETE, { messageId });
      }
      const visitor = await conversation.populate('visitor');
      io.to(`visitor:${visitor.visitor.visitorId}`).emit(SOCKET_EVENTS.MESSAGE_DELETE, { messageId });
    } catch (error) {
      logger.error('Message delete error:', error);
    }
  });

  /**
   * Add reaction
   */
  socket.on(SOCKET_EVENTS.MESSAGE_REACTION, async (data) => {
    try {
      const { messageId, emoji } = data;

      const message = await Message.findById(messageId);
      if (!message) return;

      const userId = socket.user?._id || socket.visitor?._id;
      await message.addReaction(emoji, userId);

      // Broadcast to conversation
      const conversation = await Conversation.findById(message.conversation);
      if (conversation.assignedTo) {
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.MESSAGE_REACTION, {
          messageId,
          reactions: message.reactions,
        });
      }
      const visitor = await conversation.populate('visitor');
      io.to(`visitor:${visitor.visitor.visitorId}`).emit(SOCKET_EVENTS.MESSAGE_REACTION, {
        messageId,
        reactions: message.reactions,
      });
    } catch (error) {
      logger.error('Message reaction error:', error);
    }
  });

  /**
   * Sneak peek (see what visitor is typing)
   */
  socket.on(SOCKET_EVENTS.SNEAK_PEEK, async (data) => {
    try {
      if (socket.userType !== 'visitor') return;

      const { conversationId, text } = data;
      const conversation = await Conversation.findById(conversationId);

      if (conversation && conversation.assignedTo) {
        io.to(`agent:${conversation.assignedTo}`).emit(SOCKET_EVENTS.SNEAK_PEEK, {
          conversationId,
          text,
          visitorId: socket.visitor.visitorId,
        });
      }
    } catch (error) {
      logger.error('Sneak peek error:', error);
    }
  });
};
