const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Facebook Messenger Integration Service
 * User needs to provide FACEBOOK_PAGE_TOKEN in environment variables
 */

const FACEBOOK_PAGE_TOKEN = process.env.FACEBOOK_PAGE_TOKEN;
const FACEBOOK_API_URL = 'https://graph.facebook.com/v17.0/me';

/**
 * Send Facebook Messenger message
 */
const sendMessage = async (recipientId, message) => {
  try {
    if (!FACEBOOK_PAGE_TOKEN) {
      logger.warn('Facebook Page Token not configured');
      return null;
    }

    const response = await axios.post(
      `${FACEBOOK_API_URL}/messages`,
      {
        recipient: { id: recipientId },
        message: { text: message },
      },
      {
        params: {
          access_token: FACEBOOK_PAGE_TOKEN,
        },
      }
    );

    logger.info(`Facebook message sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    logger.error('Facebook send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send typing indicator
 */
const sendTypingIndicator = async (recipientId, action = 'typing_on') => {
  try {
    if (!FACEBOOK_PAGE_TOKEN) {
      return null;
    }

    const response = await axios.post(
      `${FACEBOOK_API_URL}/messages`,
      {
        recipient: { id: recipientId },
        sender_action: action, // typing_on, typing_off, mark_seen
      },
      {
        params: {
          access_token: FACEBOOK_PAGE_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Facebook typing indicator error:', error);
    throw error;
  }
};

/**
 * Send attachment (image, file, etc.)
 */
const sendAttachment = async (recipientId, attachmentType, attachmentUrl) => {
  try {
    if (!FACEBOOK_PAGE_TOKEN) {
      return null;
    }

    const response = await axios.post(
      `${FACEBOOK_API_URL}/messages`,
      {
        recipient: { id: recipientId },
        message: {
          attachment: {
            type: attachmentType, // image, video, audio, file
            payload: {
              url: attachmentUrl,
              is_reusable: true,
            },
          },
        },
      },
      {
        params: {
          access_token: FACEBOOK_PAGE_TOKEN,
        },
      }
    );

    logger.info(`Facebook attachment sent to ${recipientId}`);
    return response.data;
  } catch (error) {
    logger.error('Facebook attachment send error:', error);
    throw error;
  }
};

/**
 * Get user profile information
 */
const getUserProfile = async (userId) => {
  try {
    if (!FACEBOOK_PAGE_TOKEN) {
      return null;
    }

    const response = await axios.get(
      `https://graph.facebook.com/v17.0/${userId}`,
      {
        params: {
          fields: 'first_name,last_name,profile_pic',
          access_token: FACEBOOK_PAGE_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Facebook user profile error:', error);
    throw error;
  }
};

/**
 * Handle incoming Facebook webhook
 */
const handleWebhook = async (webhookData) => {
  try {
    // Webhook verification
    if (webhookData['hub.mode'] === 'subscribe' && webhookData['hub.verify_token']) {
      // Verify token should match your configured token
      return webhookData['hub.challenge'];
    }

    // Process incoming messages
    if (webhookData.entry && webhookData.entry.length > 0) {
      const entry = webhookData.entry[0];
      
      if (entry.messaging && entry.messaging.length > 0) {
        const messagingEvent = entry.messaging[0];
        
        if (messagingEvent.message) {
          return {
            senderId: messagingEvent.sender.id,
            recipientId: messagingEvent.recipient.id,
            timestamp: messagingEvent.timestamp,
            message: messagingEvent.message.text || '',
            attachments: messagingEvent.message.attachments || [],
          };
        }
      }
    }

    return null;
  } catch (error) {
    logger.error('Facebook webhook handling error:', error);
    throw error;
  }
};

/**
 * Send quick replies
 */
const sendQuickReplies = async (recipientId, text, quickReplies) => {
  try {
    if (!FACEBOOK_PAGE_TOKEN) {
      return null;
    }

    const response = await axios.post(
      `${FACEBOOK_API_URL}/messages`,
      {
        recipient: { id: recipientId },
        message: {
          text: text,
          quick_replies: quickReplies.map(reply => ({
            content_type: 'text',
            title: reply.title,
            payload: reply.payload,
          })),
        },
      },
      {
        params: {
          access_token: FACEBOOK_PAGE_TOKEN,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Facebook quick replies error:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  sendTypingIndicator,
  sendAttachment,
  getUserProfile,
  handleWebhook,
  sendQuickReplies,
};
