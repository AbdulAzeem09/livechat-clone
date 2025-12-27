const axios = require('axios');
const logger = require('../utils/logger');

/**
 * WhatsApp Business API Integration Service
 * User needs to provide WHATSAPP_API_TOKEN and WHATSAPP_PHONE_ID in environment variables
 */

const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';

/**
 * Send WhatsApp message
 */
const sendMessage = async (to, message) => {
  try {
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID) {
      logger.warn('WhatsApp credentials not configured');
      return null;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`WhatsApp message sent to ${to}`);
    return response.data;
  } catch (error) {
    logger.error('WhatsApp send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send WhatsApp template message
 */
const sendTemplateMessage = async (to, templateName, languageCode, parameters = []) => {
  try {
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID) {
      logger.warn('WhatsApp credentials not configured');
      return null;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
          components: [
            {
              type: 'body',
              parameters: parameters.map(p => ({
                type: 'text',
                text: p,
              })),
            },
          ],
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`WhatsApp template message sent to ${to}`);
    return response.data;
  } catch (error) {
    logger.error('WhatsApp template send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send media message
 */
const sendMediaMessage = async (to, mediaType, mediaUrl, caption = '') => {
  try {
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID) {
      logger.warn('WhatsApp credentials not configured');
      return null;
    }

    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: mediaType, // image, video, document
      [mediaType]: {
        link: mediaUrl,
      },
    };

    if (caption && (mediaType === 'image' || mediaType === 'video')) {
      payload[mediaType].caption = caption;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`WhatsApp media message sent to ${to}`);
    return response.data;
  } catch (error) {
    logger.error('WhatsApp media send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Handle incoming WhatsApp webhook
 */
const handleWebhook = async (webhookData) => {
  try {
    // Webhook verification
    if (webhookData.hub?.mode === 'subscribe' && webhookData.hub?.verify_token) {
      // Verify token should match your configured token
      return webhookData.hub.challenge;
    }

    // Process incoming messages
    if (webhookData.entry && webhookData.entry.length > 0) {
      const entry = webhookData.entry[0];
      const changes = entry.changes[0];
      const value = changes.value;

      if (value.messages && value.messages.length > 0) {
        const message = value.messages[0];
        
        return {
          from: message.from,
          type: message.type,
          content: message.text?.body || '',
          timestamp: message.timestamp,
          messageId: message.id,
        };
      }
    }

    return null;
  } catch (error) {
    logger.error('WhatsApp webhook handling error:', error);
    throw error;
  }
};

/**
 * Mark message as read
 */
const markAsRead = async (messageId) => {
  try {
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_ID) {
      return null;
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('WhatsApp mark as read error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  sendMessage,
  sendTemplateMessage,
  sendMediaMessage,
  handleWebhook,
  markAsRead,
};
