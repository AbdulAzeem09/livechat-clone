const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Visitor = require('../models/Visitor');
const { CONVERSATION_STATUS, MESSAGE_STATUS } = require('../config/constants');
const { generateConversationId } = require('../utils/helpers');
const notificationService = require('./notificationService');
const webhookService = require('./webhookService');

/**
 * Create a new conversation
 */
const createConversation = async (visitorId, departmentId = null) => {
  try {
    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) {
      throw new Error('Visitor not found');
    }

    const conversation = await Conversation.create({
      conversationId: generateConversationId(),
      visitor: visitor._id,
      department: departmentId,
      status: CONVERSATION_STATUS.PENDING,
    });

    // Trigger webhook
    webhookService.trigger('conversation.new', conversation);

    return conversation;
  } catch (error) {
    throw error;
  }
};

/**
 * Send a message
 */
const sendMessage = async (conversationId, senderData, content, type = 'text', attachments = []) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: senderData,
      type,
      content,
      attachments,
      status: MESSAGE_STATUS.SENT,
    });

    // Update conversation
    conversation.lastMessageAt = new Date();
    
    // Update unread count
    if (senderData.type === 'visitor') {
      conversation.unreadCount.agent += 1;
    } else if (senderData.type === 'agent') {
      conversation.unreadCount.visitor += 1;
      
      // Set first response time if not set
      if (!conversation.firstResponseAt) {
        conversation.firstResponseAt = new Date();
      }
    }

    // Change status to active if pending
    if (conversation.status === CONVERSATION_STATUS.PENDING) {
      conversation.status = CONVERSATION_STATUS.ACTIVE;
    }

    await conversation.save();

    // Trigger webhook
    webhookService.trigger('message.new', { message, conversation });

    // Send notification
    notificationService.notifyNewMessage(conversation, message);

    return message;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark messages as read
 */
const markAsRead = async (conversationId, readerType) => {
  try {
    const messages = await Message.find({
      conversation: conversationId,
      'sender.type': { $ne: readerType },
      status: { $ne: MESSAGE_STATUS.READ },
      isDeleted: false,
    });

    const updatePromises = messages.map(msg => msg.markAsRead());
    await Promise.all(updatePromises);

    // Reset unread count
    const conversation = await Conversation.findById(conversationId);
    if (readerType === 'agent') {
      conversation.unreadCount.agent = 0;
    } else {
      conversation.unreadCount.visitor = 0;
    }
    await conversation.save();

    return messages.length;
  } catch (error) {
    throw error;
  }
};

/**
 * Assign conversation to agent
 */
const assignConversation = async (conversationId, agentId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.assignedTo = agentId;
    if (conversation.status === CONVERSATION_STATUS.PENDING) {
      conversation.status = CONVERSATION_STATUS.ACTIVE;
    }
    await conversation.save();

    // Trigger webhook
    webhookService.trigger('conversation.assigned', conversation);

    // Send notification to agent
    notificationService.notifyAssignment(conversation, agentId);

    return conversation;
  } catch (error) {
    throw error;
  }
};

/**
 * Transfer conversation to another agent
 */
const transferConversation = async (conversationId, fromAgentId, toAgentId, reason = '') => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.assignedTo = toAgentId;
    conversation.transferHistory.push({
      from: fromAgentId,
      to: toAgentId,
      reason,
      transferredAt: new Date(),
    });
    await conversation.save();

    // Notify both agents
    notificationService.notifyTransfer(conversation, fromAgentId, toAgentId);

    return conversation;
  } catch (error) {
    throw error;
  }
};

/**
 * Resolve conversation
 */
const resolveConversation = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.status = CONVERSATION_STATUS.RESOLVED;
    conversation.resolvedAt = new Date();
    await conversation.save();

    // Trigger webhook
    webhookService.trigger('conversation.resolved', conversation);

    return conversation;
  } catch (error) {
    throw error;
  }
};

/**
 * Close conversation
 */
const closeConversation = async (conversationId) => {
  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    conversation.status = CONVERSATION_STATUS.CLOSED;
    conversation.closedAt = new Date();
    await conversation.save();

    // Trigger webhook
    webhookService.trigger('conversation.closed', conversation);

    return conversation;
  } catch (error) {
    throw error;
  }
};

/**
 * Get conversation messages
 */
const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const skip = (page - 1) * limit;
    
    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('replyTo', 'content sender');

    return messages.reverse(); // Return in chronological order
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createConversation,
  sendMessage,
  markAsRead,
  assignConversation,
  transferConversation,
  resolveConversation,
  closeConversation,
  getMessages,
};
