const axios = require('axios');
const logger = require('../utils/logger');

/**
 * SMS Service using Twilio
 * User needs to provide TWILIO credentials in environment variables
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_API_URL = 'https://api.twilio.com/2010-04-01';

/**
 * Send SMS
 */
const sendSMS = async (to, message) => {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      logger.warn('Twilio credentials not configured');
      return null;
    }

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await axios.post(
      `${TWILIO_API_URL}/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        To: to,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    logger.info(`SMS sent to ${to}`);
    return response.data;
  } catch (error) {
    logger.error('SMS send error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send notification SMS to agent
 */
const sendAgentNotification = async (phoneNumber, message) => {
  try {
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    logger.error('Agent notification SMS error:', error);
    throw error;
  }
};

/**
 * Send verification code
 */
const sendVerificationCode = async (phoneNumber, code) => {
  try {
    const message = `Your verification code is: ${code}. This code will expire in 10 minutes.`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    logger.error('Verification code SMS error:', error);
    throw error;
  }
};

/**
 * Send new message notification
 */
const sendNewMessageNotification = async (phoneNumber, senderName) => {
  try {
    const message = `You have a new message from ${senderName}. Login to your dashboard to reply.`;
    return await sendSMS(phoneNumber, message);
  } catch (error) {
    logger.error('New message notification SMS error:', error);
    throw error;
  }
};

/**
 * Get message status
 */
const getMessageStatus = async (messageSid) => {
  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
      return null;
    }

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await axios.get(
      `${TWILIO_API_URL}/Accounts/${TWILIO_ACCOUNT_SID}/Messages/${messageSid}.json`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Get message status error:', error);
    throw error;
  }
};

module.exports = {
  sendSMS,
  sendAgentNotification,
  sendVerificationCode,
  sendNewMessageNotification,
  getMessageStatus,
};
