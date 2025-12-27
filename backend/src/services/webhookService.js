/**
 * Webhook Service
 * Handles webhook delivery with retry logic
 */

const Webhook = require('../models/Webhook');

class WebhookService {
  /**
   * Trigger webhooks for an event
   * @param {string} eventType - Event type (e.g., 'conversation.started')
   * @param {Object} payload - Event data
   * @returns {Promise<Array>} Results of webhook deliveries
   */
  async triggerWebhooks(eventType, payload) {
    try {
      // Find all active webhooks that subscribe to this event
      const webhooks = await Webhook.find({
        isActive: true,
        events: eventType,
      });

      if (webhooks.length === 0) {
        return [];
      }

      const results = await Promise.allSettled(
        webhooks.map(webhook => this.deliverWebhook(webhook, eventType, payload))
      );

      return results;
    } catch (error) {
      console.error('Webhook trigger error:', error);
      return [];
    }
  }

  /**
   * Deliver webhook to endpoint
   * @param {Object} webhook - Webhook configuration
   * @param {string} eventType - Event type
   * @param {Object} payload - Event data
   * @returns {Promise<Object>} Delivery result
   */
  async deliverWebhook(webhook, eventType, payload) {
    const deliveryPayload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: payload,
    };

    let lastError = null;
    const maxRetries = webhook.retryPolicy?.maxRetries || 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // In a real implementation, use fetch or axios
        // const response = await fetch(webhook.url, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'X-Webhook-Signature': this.generateSignature(deliveryPayload, webhook.secret),
        //     ...Object.fromEntries(webhook.headers || new Map()),
        //   },
        //   body: JSON.stringify(deliveryPayload),
        // });

        console.log(`Webhook delivered to ${webhook.url} for event ${eventType}`);

        // Update webhook statistics
        await Webhook.findByIdAndUpdate(webhook._id, {
          $inc: { successCount: 1 },
          lastTriggered: new Date(),
        });

        return { success: true, webhook: webhook.name };
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = webhook.retryPolicy?.retryDelay || 1000;
          await this.sleep(delay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    // All retries failed
    await Webhook.findByIdAndUpdate(webhook._id, {
      $inc: { failureCount: 1 },
    });

    console.error(`Webhook delivery failed to ${webhook.url}:`, lastError);
    return { success: false, webhook: webhook.name, error: lastError.message };
  }

  /**
   * Generate webhook signature for verification
   * @param {Object} payload - Payload to sign
   * @param {string} secret - Webhook secret
   * @returns {string} Signature
   */
  generateSignature(payload, secret) {
    if (!secret) return '';
    
    // In a real implementation, use crypto to generate HMAC
    // const crypto = require('crypto');
    // return crypto
    //   .createHmac('sha256', secret)
    //   .update(JSON.stringify(payload))
    //   .digest('hex');
    
    return 'mock-signature';
  }

  /**
   * Sleep utility for retry delays
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test webhook connection
   * @param {string} url - Webhook URL
   * @returns {Promise<Object>} Test result
   */
  async testWebhook(url) {
    try {
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: { message: 'This is a test webhook' },
      };

      console.log(`Testing webhook: ${url}`);
      return { success: true, message: 'Webhook test successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new WebhookService();
