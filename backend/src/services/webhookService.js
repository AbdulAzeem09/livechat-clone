const axios = require('axios');
const Webhook = require('../models/Webhook');
const logger = require('../utils/logger');

/**
 * Trigger webhook for an event
 */
const trigger = async (eventType, data) => {
  try {
    const webhooks = await Webhook.find({
      isActive: true,
      events: eventType,
    });

    for (const webhook of webhooks) {
      await sendWebhook(webhook, eventType, data);
    }
  } catch (error) {
    logger.error('Error triggering webhooks:', error);
  }
};

/**
 * Send webhook request
 */
const sendWebhook = async (webhook, eventType, data, retryCount = 0) => {
  try {
    const payload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'LiveChat-Webhook/1.0',
    };

    // Add custom headers
    if (webhook.headers && webhook.headers.size > 0) {
      webhook.headers.forEach((value, key) => {
        headers[key] = value;
      });
    }

    // Add signature if secret is provided
    if (webhook.secret) {
      const crypto = require('crypto');
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(JSON.stringify(payload))
        .digest('hex');
      headers['X-Webhook-Signature'] = signature;
    }

    const response = await axios.post(webhook.url, payload, {
      headers,
      timeout: 10000, // 10 seconds
    });

    if (response.status >= 200 && response.status < 300) {
      await webhook.recordSuccess();
      logger.info(`Webhook sent successfully: ${webhook.name} for event ${eventType}`);
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    logger.error(`Webhook failed: ${webhook.name} for event ${eventType}`, error.message);

    // Retry logic
    if (retryCount < webhook.retryPolicy.maxRetries) {
      logger.info(`Retrying webhook ${webhook.name} (attempt ${retryCount + 1})`);
      
      setTimeout(async () => {
        await sendWebhook(webhook, eventType, data, retryCount + 1);
      }, webhook.retryPolicy.retryDelay * 1000);
    } else {
      await webhook.recordFailure(error.message);
    }
  }
};

/**
 * Test webhook
 */
const testWebhook = async (webhookId) => {
  try {
    const webhook = await Webhook.findById(webhookId);
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    const testData = {
      message: 'This is a test webhook',
      timestamp: new Date().toISOString(),
    };

    await sendWebhook(webhook, 'test', testData);
    return { success: true, message: 'Test webhook sent' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  trigger,
  sendWebhook,
  testWebhook,
};
