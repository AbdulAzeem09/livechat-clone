# 🚀 LiveChat Clone - Full-Featured Customer Support Application

A comprehensive, production-ready customer support chat application with real-time messaging, visitor tracking, analytics, and extensive integration capabilities.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6+-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🔥 Core Features
- **Real-Time Chat**: WebSocket-powered instant messaging with Socket.io
- **Visitor Tracking**: Comprehensive visitor tracking with geolocation, browser info, and behavior analysis
- **Conversation Management**: Full conversation lifecycle with assignment, transfer, and status tracking
- **Agent Dashboard**: Modern React dashboard for managing conversations and visitor interactions
- **Embeddable Widget**: Customizable chat widget for easy website integration
- **Multi-Channel Support**: Ready for WhatsApp, Facebook Messenger, Telegram integration

### 💼 Business Features
- **Departments**: Organize agents into departments with custom routing
- **Canned Responses**: Quick reply templates with shortcuts
- **Triggers & Automation**: Auto-greet visitors based on behavior and conditions
- **Business Hours**: Configure working hours and holidays
- **Analytics & Reporting**: Comprehensive metrics, charts, and CSV exports
- **Webhooks**: Real-time event notifications to external systems

### 🤖 AI & Integrations (Hooks Ready)
- **OpenAI GPT**: AI-powered response suggestions and conversation summarization
- **WhatsApp**: Send/receive messages via WhatsApp Business API
- **Facebook Messenger**: Integrate Facebook page messaging
- **Telegram**: Bot integration for Telegram chats
- **Email**: SMTP email notifications and transcript delivery
- **SMS**: Twilio SMS notifications

### 🎨 Advanced Features
- Message reactions with emojis
- Reply to specific messages
- Edit and delete messages
- File and image uploads
- Typing indicators
- Read receipts
- Sneak peek (see what visitor is typing)
- Conversation ratings
- Internal notes
- Tag management
- Audit logs

### 🔒 Security
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- Input validation
- XSS protection
- CORS configuration
- Helmet security headers

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** 6.0+
- **Redis** (optional, for caching and sessions)
- **SMTP Server** (optional, for email notifications)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/AbdulAzeem09/livechat-clone.git
cd livechat-clone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/livechat
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-change-this-in-production
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

Start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"password123","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

## 📁 Project Structure

```
livechat-clone/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, constants
│   │   ├── middleware/      # Auth, validation, rate limiting
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── socket/          # Socket.io handlers
│   │   ├── services/        # Business logic & integrations
│   │   ├── utils/           # Helper functions
│   │   └── app.js          # Main application
│   ├── package.json
│   └── .env.example
├── dashboard/              # React dashboard (to be implemented)
├── widget/                 # Embeddable widget (to be implemented)
├── docker-compose.yml     # Docker setup (to be created)
├── .gitignore
├── .env.example
└── README.md
```

## 🔌 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "agent"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Conversations

#### Get All Conversations
```http
GET /api/conversations?page=1&limit=30&status=active
Authorization: Bearer <token>
```

#### Get Conversation by ID
```http
GET /api/conversations/:id
Authorization: Bearer <token>
```

#### Assign Conversation
```http
POST /api/conversations/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentId": "agent_id_here"
}
```

#### Update Status
```http
PUT /api/conversations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved"
}
```

### Messages

#### Get Messages
```http
GET /api/messages/:conversationId?page=1&limit=50
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "conv_id",
  "content": "Hello, how can I help you?",
  "type": "text"
}
```

### Analytics

#### Dashboard Stats
```http
GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

#### Agent Performance
```http
GET /api/analytics/agent-performance?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

## 🔌 Socket.io Events

### Client → Server

- `message:send` - Send a message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `message:read` - Mark message as read
- `agent:status:change` - Change agent status
- `visitor:page:view` - Track page view

### Server → Client

- `message:receive` - New message received
- `message:delivered` - Message delivered
- `message:read` - Message read
- `typing:start` - Someone started typing
- `typing:stop` - Someone stopped typing
- `agent:online` - Agent came online
- `agent:offline` - Agent went offline
- `conversation:assigned` - Conversation assigned

## 🔗 Third-Party Integrations

### OpenAI GPT

Add to `.env`:
```env
OPENAI_API_KEY=sk-your-api-key
```

### WhatsApp Business API

Add to `.env`:
```env
WHATSAPP_API_TOKEN=your-token
WHATSAPP_PHONE_ID=your-phone-id
```

### Facebook Messenger

Add to `.env`:
```env
FACEBOOK_PAGE_TOKEN=your-page-token
FACEBOOK_APP_SECRET=your-app-secret
```

### Telegram Bot

Add to `.env`:
```env
TELEGRAM_BOT_TOKEN=your-bot-token
```

### Twilio SMS

Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number
```

### SMTP Email

Add to `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourcompany.com
```

## 🐳 Docker Setup (Coming Soon)

```bash
docker-compose up -d
```

## 📊 Database Models

### Core Models
- **User**: Agents and administrators
- **Visitor**: Website visitors with tracking data
- **Conversation**: Chat conversations with status and assignment
- **Message**: Individual messages with reactions and replies
- **CannedResponse**: Quick reply templates
- **Department**: Agent departments
- **Trigger**: Automation rules
- **Widget**: Widget configurations
- **Webhook**: External webhooks
- **Tag**: Labels for conversations and visitors
- **BusinessHours**: Working hours configuration
- **AuditLog**: System audit trail

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

Built with:
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Redis](https://redis.io/)
- [React](https://reactjs.org/) (Dashboard - to be implemented)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This is a full-featured LiveChat clone with production-ready backend. The dashboard and widget frontends are planned for implementation. All integration services are configured with hooks ready for your API keys.
