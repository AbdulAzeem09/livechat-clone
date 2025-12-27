/**
 * Email Service
 * Handles email notifications and communication
 */

class EmailService {
  constructor() {
    this.smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    this.smtpPort = process.env.SMTP_PORT || 587;
    this.smtpUser = process.env.SMTP_USER || '';
    this.smtpPass = process.env.SMTP_PASS || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@livechat.com';
    this.fromName = process.env.FROM_NAME || 'LiveChat Support';
  }

  /**
   * Send email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - HTML content
   * @param {string} text - Plain text content
   * @returns {Promise<Object>} Send result
   */
  async sendEmail(to, subject, html, text = '') {
    if (!this.smtpUser || !this.smtpPass) {
      console.warn('SMTP credentials not configured');
      return { success: false, error: 'SMTP not configured' };
    }

    try {
      // In a real implementation, use nodemailer or similar
      // const transporter = nodemailer.createTransport({
      //   host: this.smtpHost,
      //   port: this.smtpPort,
      //   secure: false,
      //   auth: {
      //     user: this.smtpUser,
      //     pass: this.smtpPass,
      //   },
      // });
      
      // const info = await transporter.sendMail({
      //   from: `"${this.fromName}" <${this.fromEmail}>`,
      //   to: to,
      //   subject: subject,
      //   text: text,
      //   html: html,
      // });

      console.log(`Email would be sent to ${to}: ${subject}`);
      return { success: true, messageId: 'mock-email-id' };
    } catch (error) {
      console.error('Email Service Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send conversation transcript
   * @param {string} to - Recipient email
   * @param {Object} conversation - Conversation object
   * @param {Array} messages - Messages array
   * @returns {Promise<Object>} Send result
   */
  async sendTranscript(to, conversation, messages) {
    const subject = `Chat Transcript - Conversation #${conversation._id}`;
    
    const html = `
      <h2>Chat Transcript</h2>
      <p><strong>Date:</strong> ${new Date(conversation.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> ${conversation.status}</p>
      <hr>
      <div style="font-family: Arial, sans-serif;">
        ${messages.map(msg => `
          <div style="margin: 10px 0;">
            <strong>${msg.sender === 'agent' ? 'Agent' : 'You'}:</strong>
            <p>${msg.content}</p>
            <small style="color: #666;">${new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        `).join('')}
      </div>
    `;

    return this.sendEmail(to, subject, html);
  }

  /**
   * Send notification email to agent
   * @param {string} agentEmail - Agent email
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @returns {Promise<Object>} Send result
   */
  async sendNotification(agentEmail, title, message) {
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #FF5100;">${title}</h2>
        <p>${message}</p>
        <a href="${process.env.DASHBOARD_URL || 'http://localhost:3000'}" 
           style="background-color: #FF5100; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
          View Dashboard
        </a>
      </div>
    `;

    return this.sendEmail(agentEmail, title, html);
  }

  /**
   * Send welcome email
   * @param {string} to - User email
   * @param {string} name - User name
   * @returns {Promise<Object>} Send result
   */
  async sendWelcomeEmail(to, name) {
    const subject = 'Welcome to LiveChat!';
    const html = `
      <h2>Welcome ${name}!</h2>
      <p>Thank you for joining LiveChat. We're excited to have you on board.</p>
      <p>Get started by logging into your dashboard and exploring all the features.</p>
    `;

    return this.sendEmail(to, subject, html);
  }
}

module.exports = new EmailService();
