# Third-Party Integration Setup Guide

This guide explains how to set up third-party integrations for LiveChat Clone.

## 🤖 OpenAI GPT Integration

### Setup

1. Sign up for OpenAI API access at https://platform.openai.com/
2. Create an API key from the API keys section
3. Add to your `.env` file:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### Features Available

- **AI Response Suggestions**: Get AI-powered response suggestions based on conversation context
- **Intent Detection**: Automatically detect customer intent (question, complaint, request, etc.)
- **Conversation Summarization**: Generate summaries of long conversations
- **Sentiment Analysis**: Analyze customer sentiment (positive, negative, neutral)

### Usage Example

The AI service is integrated into the chat system and can be triggered programmatically:

```javascript
const aiService = require('./services/aiService');

// Generate response suggestion
const suggestion = await aiService.suggestResponse(conversationHistory);

// Detect intent
const intent = await aiService.detectIntent(message);

// Summarize conversation
const summary = await aiService.summarizeConversation(messages);
```

---

## 📱 WhatsApp Business API Integration

### Setup

1. Create a Facebook Business account
2. Set up WhatsApp Business API through Meta Business Suite
3. Get your API token and Phone Number ID
4. Add to `.env`:

```env
WHATSAPP_API_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_ID=your-phone-number-id
```

### Webhook Setup

1. Set up a webhook endpoint on your server
2. Use the webhook route in the backend: `/api/webhooks/whatsapp`
3. Configure the webhook URL in Meta Business Suite

### Features Available

- Send text messages
- Send template messages (pre-approved by WhatsApp)
- Send media (images, documents)
- Receive incoming messages
- Mark messages as read

### Usage Example

```javascript
const whatsappService = require('./services/whatsappService');

// Send text message
await whatsappService.sendMessage('+1234567890', 'Hello from LiveChat!');

// Send template message
await whatsappService.sendTemplateMessage(
  '+1234567890',
  'hello_world',
  'en_US',
  ['Parameter 1', 'Parameter 2']
);

// Send media
await whatsappService.sendMediaMessage(
  '+1234567890',
  'image',
  'https://example.com/image.jpg',
  'Check this out!'
);
```

---

## 💬 Facebook Messenger Integration

### Setup

1. Create a Facebook Page for your business
2. Create a Facebook App at https://developers.facebook.com/
3. Add Messenger product to your app
4. Generate a Page Access Token
5. Add to `.env`:

```env
FACEBOOK_PAGE_TOKEN=your-page-access-token
FACEBOOK_APP_SECRET=your-app-secret
```

### Webhook Setup

1. Configure webhook in your Facebook App settings
2. Use the webhook route: `/api/webhooks/facebook`
3. Verify token should match your configured secret

### Features Available

- Send and receive messages
- Send typing indicators
- Send attachments (images, files)
- Get user profile information
- Send quick replies and buttons

### Usage Example

```javascript
const facebookService = require('./services/facebookService');

// Send message
await facebookService.sendMessage(recipientId, 'Hello from LiveChat!');

// Send typing indicator
await facebookService.sendTypingIndicator(recipientId, 'typing_on');

// Send attachment
await facebookService.sendAttachment(
  recipientId,
  'image',
  'https://example.com/image.jpg'
);

// Get user profile
const profile = await facebookService.getUserProfile(userId);
```

---

## 🤖 Telegram Bot Integration

### Setup

1. Create a bot with BotFather on Telegram (@BotFather)
2. Get your bot token
3. Add to `.env`:

```env
TELEGRAM_BOT_TOKEN=your-bot-token
```

### Webhook Setup

1. Set webhook URL using the service:

```javascript
const telegramService = require('./services/telegramService');
await telegramService.setWebhook('https://yourdomain.com/api/webhooks/telegram');
```

### Features Available

- Send text messages
- Send photos and documents
- Send typing actions
- Inline keyboards
- Handle incoming messages

### Usage Example

```javascript
const telegramService = require('./services/telegramService');

// Send message
await telegramService.sendMessage(chatId, 'Hello from LiveChat!');

// Send photo
await telegramService.sendPhoto(chatId, 'https://example.com/image.jpg', 'Caption');

// Send document
await telegramService.sendDocument(chatId, 'https://example.com/doc.pdf');

// Send inline keyboard
await telegramService.sendInlineKeyboard(
  chatId,
  'Choose an option:',
  [
    [{ text: 'Option 1', callback_data: 'opt1' }],
    [{ text: 'Option 2', callback_data: 'opt2' }]
  ]
);
```

---

## 📧 Email Integration (SMTP)

### Setup

1. Get SMTP credentials from your email provider
2. For Gmail, you may need to create an App Password
3. Add to `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourcompany.com
```

### Common SMTP Settings

**Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

**Outlook:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Features Available

- Send chat transcripts
- Send agent notifications
- Send offline messages
- Send welcome emails
- Custom email templates

### Usage Example

```javascript
const emailService = require('./services/emailService');

// Send chat transcript
await emailService.sendTranscript(
  'customer@example.com',
  conversationData,
  messages
);

// Send notification
await emailService.sendAgentNotification(
  'agent@example.com',
  'New Chat Assigned',
  'You have been assigned a new conversation'
);

// Send custom email
await emailService.sendEmail(
  'recipient@example.com',
  'Subject',
  '<p>HTML content</p>'
);
```

---

## 📱 SMS Integration (Twilio)

### Setup

1. Create a Twilio account at https://www.twilio.com/
2. Get a phone number
3. Get your Account SID and Auth Token
4. Add to `.env`:

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Features Available

- Send SMS messages
- Send agent notifications
- Send verification codes
- Check message delivery status

### Usage Example

```javascript
const smsService = require('./services/smsService');

// Send SMS
await smsService.sendSMS('+1234567890', 'Hello from LiveChat!');

// Send agent notification
await smsService.sendAgentNotification(
  '+1234567890',
  'You have a new chat assigned'
);

// Send verification code
await smsService.sendVerificationCode('+1234567890', '123456');

// Get message status
const status = await smsService.getMessageStatus(messageSid);
```

---

## 🔗 Webhooks

### Setup

Create webhooks to send real-time notifications to external systems.

### Available Events

- `conversation.new` - New conversation created
- `conversation.assigned` - Conversation assigned to agent
- `conversation.resolved` - Conversation resolved
- `conversation.closed` - Conversation closed
- `message.new` - New message sent/received
- `rating.received` - Customer rating received
- `agent.status.changed` - Agent status changed

### Creating a Webhook

```http
POST /api/webhooks
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Slack Notifications",
  "url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
  "events": ["conversation.new", "message.new"],
  "isActive": true,
  "secret": "your-webhook-secret",
  "headers": {
    "Custom-Header": "value"
  }
}
```

### Webhook Payload Format

```json
{
  "event": "conversation.new",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "data": {
    "conversationId": "conv_123",
    "visitor": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "status": "pending"
  }
}
```

### Webhook Security

Webhooks include a signature header for verification:

```
X-Webhook-Signature: <hmac-sha256-signature>
```

Verify the signature using:

```javascript
const crypto = require('crypto');

const signature = crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(payload))
  .digest('hex');

if (signature === receivedSignature) {
  // Valid webhook
}
```

---

## 🔄 Testing Integrations

### Test Webhook
```http
POST /api/webhooks/:id/test
Authorization: Bearer <admin-token>
```

### Check Integration Status

All integration services will log warnings if credentials are not configured:

```
WARN: OpenAI API key not configured
WARN: WhatsApp credentials not configured
```

Check your console logs to see which integrations need configuration.

---

## 🆘 Troubleshooting

### OpenAI Integration Issues

- **Error: Invalid API key** - Check that your API key is correct and active
- **Error: Rate limit exceeded** - You've exceeded your API quota. Check your OpenAI dashboard

### WhatsApp Integration Issues

- **Messages not sending** - Verify your phone number is connected and approved
- **Webhook not receiving messages** - Check that webhook URL is accessible and properly configured

### Email Integration Issues

- **Emails not sending** - Check SMTP credentials and firewall settings
- **Gmail blocking** - Enable "Less secure app access" or use App Passwords

### SMS Integration Issues

- **SMS not sending** - Verify phone number format (must include country code)
- **Delivery failures** - Check Twilio logs for detailed error messages

---

## 💡 Best Practices

1. **Store API keys securely** - Never commit API keys to version control
2. **Use environment variables** - Keep all credentials in `.env` file
3. **Monitor API usage** - Track your API usage to avoid unexpected charges
4. **Implement error handling** - Gracefully handle API failures
5. **Test webhooks** - Use webhook testing tools before production
6. **Rotate credentials regularly** - Change API keys periodically for security

---

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Nodemailer Documentation](https://nodemailer.com/)
