const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Email Service using SMTP
 * User needs to provide SMTP credentials in environment variables
 */

let transporter = null;

/**
 * Initialize email transporter
 */
const initializeTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    logger.warn('SMTP credentials not configured');
    return null;
  }

  try {
    transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    logger.info('Email transporter initialized');
    return transporter;
  } catch (error) {
    logger.error('Error initializing email transporter:', error);
    return null;
  }
};

/**
 * Send email
 */
const sendEmail = async (to, subject, html, text = null) => {
  try {
    if (!transporter) {
      transporter = initializeTransporter();
    }

    if (!transporter) {
      logger.warn('Cannot send email - transporter not initialized');
      return null;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Send chat transcript
 */
const sendTranscript = async (email, conversationData, messages) => {
  try {
    const messagesHtml = messages
      .map(msg => `
        <div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
          <strong>${msg.sender.name || 'Anonymous'}:</strong> ${msg.content}
          <br><small style="color: #666;">${new Date(msg.createdAt).toLocaleString()}</small>
        </div>
      `)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Chat Transcript</h2>
          </div>
          <div class="content">
            <p><strong>Conversation ID:</strong> ${conversationData.conversationId}</p>
            <p><strong>Date:</strong> ${new Date(conversationData.createdAt).toLocaleString()}</p>
            <h3>Messages:</h3>
            ${messagesHtml}
          </div>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(email, 'Your Chat Transcript', html);
  } catch (error) {
    logger.error('Error sending transcript:', error);
    throw error;
  }
};

/**
 * Send notification email to agent
 */
const sendAgentNotification = async (agentEmail, subject, message) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated notification from LiveChat Clone.
          </p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(agentEmail, subject, html);
  } catch (error) {
    logger.error('Error sending agent notification:', error);
    throw error;
  }
};

/**
 * Send offline message notification
 */
const sendOfflineMessage = async (email, name, message) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>New Offline Message</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
    return await sendEmail(adminEmail, 'New Offline Message', html);
  } catch (error) {
    logger.error('Error sending offline message:', error);
    throw error;
  }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (email, name) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome to LiveChat!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with LiveChat Clone. We're excited to have you on board!</p>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The LiveChat Team</p>
        </div>
      </body>
      </html>
    `;

    return await sendEmail(email, 'Welcome to LiveChat!', html);
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  initializeTransporter,
  sendEmail,
  sendTranscript,
  sendAgentNotification,
  sendOfflineMessage,
  sendWelcomeEmail,
};
