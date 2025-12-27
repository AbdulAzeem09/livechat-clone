const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Telegram Bot Integration Service
 * User needs to provide TELEGRAM_BOT_TOKEN in environment variables
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Send Telegram message
 */
const sendMessage = async (chatId, message, parseMode = 'HTML') => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      logger.warn('Telegram Bot Token not configured');
      return null;
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: parseMode,
    });

    logger.info(`Telegram message sent to ${chatId}`);
    return response.data;
  } catch (error) {
    logger.error('Telegram send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send photo
 */
const sendPhoto = async (chatId, photoUrl, caption = '') => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
    });

    return response.data;
  } catch (error) {
    logger.error('Telegram send photo error:', error);
    throw error;
  }
};

/**
 * Send document
 */
const sendDocument = async (chatId, documentUrl, caption = '') => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/sendDocument`, {
      chat_id: chatId,
      document: documentUrl,
      caption: caption,
    });

    return response.data;
  } catch (error) {
    logger.error('Telegram send document error:', error);
    throw error;
  }
};

/**
 * Send typing action
 */
const sendChatAction = async (chatId, action = 'typing') => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/sendChatAction`, {
      chat_id: chatId,
      action: action, // typing, upload_photo, upload_document
    });

    return response.data;
  } catch (error) {
    logger.error('Telegram chat action error:', error);
    throw error;
  }
};

/**
 * Handle incoming Telegram webhook
 */
const handleWebhook = async (webhookData) => {
  try {
    if (webhookData.message) {
      const message = webhookData.message;
      
      return {
        messageId: message.message_id,
        chatId: message.chat.id,
        from: {
          id: message.from.id,
          firstName: message.from.first_name,
          lastName: message.from.last_name,
          username: message.from.username,
        },
        text: message.text || '',
        date: message.date,
        photo: message.photo || null,
        document: message.document || null,
      };
    }

    return null;
  } catch (error) {
    logger.error('Telegram webhook handling error:', error);
    throw error;
  }
};

/**
 * Set webhook URL
 */
const setWebhook = async (webhookUrl) => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
      url: webhookUrl,
    });

    logger.info(`Telegram webhook set to ${webhookUrl}`);
    return response.data;
  } catch (error) {
    logger.error('Telegram set webhook error:', error);
    throw error;
  }
};

/**
 * Get bot info
 */
const getBotInfo = async () => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    const response = await axios.get(`${TELEGRAM_API_URL}/getMe`);
    return response.data;
  } catch (error) {
    logger.error('Telegram get bot info error:', error);
    throw error;
  }
};

/**
 * Send inline keyboard
 */
const sendInlineKeyboard = async (chatId, message, buttons) => {
  try {
    if (!TELEGRAM_BOT_TOKEN) {
      return null;
    }

    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: message,
      reply_markup: {
        inline_keyboard: buttons.map(row => 
          row.map(btn => ({
            text: btn.text,
            callback_data: btn.callback_data,
          }))
        ),
      },
    });

    return response.data;
  } catch (error) {
    logger.error('Telegram inline keyboard error:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  sendPhoto,
  sendDocument,
  sendChatAction,
  handleWebhook,
  setWebhook,
  getBotInfo,
  sendInlineKeyboard,
};
