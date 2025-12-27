/**
 * SMS Service
 * Handles SMS notifications via Twilio or similar
 */

class SMSService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
    this.baseURL = 'https://api.twilio.com/2010-04-01';
  }

  /**
   * Send SMS
   * @param {string} to - Recipient phone number (E.164 format)
   * @param {string} message - Message content
   * @returns {Promise<Object>} Send result
   */
  async sendSMS(to, message) {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn('Twilio credentials not configured');
      return { success: false, error: 'SMS service not configured' };
    }

    try {
      // In a real implementation, use Twilio SDK or API
      // const client = twilio(this.accountSid, this.authToken);
      // const result = await client.messages.create({
      //   body: message,
      //   from: this.fromNumber,
      //   to: to,
      // });

      console.log(`SMS would be sent to ${to}: ${message}`);
      return { success: true, messageId: 'mock-sms-id' };
    } catch (error) {
      console.error('SMS Service Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send notification SMS to agent
   * @param {string} phoneNumber - Agent phone number
   * @param {string} message - Notification message
   * @returns {Promise<Object>} Send result
   */
  async sendAgentNotification(phoneNumber, message) {
    const formattedMessage = `[LiveChat] ${message}`;
    return this.sendSMS(phoneNumber, formattedMessage);
  }

  /**
   * Send verification code
   * @param {string} phoneNumber - Phone number
   * @param {string} code - Verification code
   * @returns {Promise<Object>} Send result
   */
  async sendVerificationCode(phoneNumber, code) {
    const message = `Your LiveChat verification code is: ${code}. Valid for 10 minutes.`;
    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Send conversation alert
   * @param {string} phoneNumber - Agent phone number
   * @param {string} visitorName - Visitor name
   * @returns {Promise<Object>} Send result
   */
  async sendConversationAlert(phoneNumber, visitorName) {
    const message = `New chat from ${visitorName}. Login to respond.`;
    return this.sendAgentNotification(phoneNumber, message);
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} Is valid
   */
  validatePhoneNumber(phoneNumber) {
    // Basic E.164 format validation
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }
}

module.exports = new SMSService();
