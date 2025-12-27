# LiveChat Backend API

Backend API server for LiveChat Clone application built with Node.js, Express, Socket.io, and MongoDB.

## Features

- JWT-based authentication
- Real-time chat with Socket.io
- RESTful API endpoints
- MongoDB database with Mongoose ODM
- Role-based access control
- Message delivery tracking
- Visitor management
- Analytics and reporting
- Canned responses

## Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/status` - Update user status (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Conversations
- `GET /api/conversations` - List all conversations (protected)
- `GET /api/conversations/:id` - Get conversation details (protected)
- `PUT /api/conversations/:id/assign` - Assign conversation to agent (protected)
- `PUT /api/conversations/:id/transfer` - Transfer conversation (protected)
- `PUT /api/conversations/:id/resolve` - Mark as resolved (protected)
- `PUT /api/conversations/:id/close` - Close conversation (protected)
- `PUT /api/conversations/:id/rate` - Rate conversation (public)

### Messages
- `GET /api/messages/:conversationId` - Get messages (protected)
- `POST /api/messages` - Send message (protected)
- `PUT /api/messages/:id/read` - Mark as read (protected)
- `PUT /api/messages/conversation/:conversationId/read-all` - Mark all as read (protected)

### Visitors
- `GET /api/visitors` - List visitors (protected)
- `GET /api/visitors/:id` - Get visitor details (protected)
- `PUT /api/visitors/:id` - Update visitor (protected)

### Analytics
- `GET /api/analytics/overview` - Get overview stats (protected)
- `GET /api/analytics/charts` - Get chart data (protected)
- `GET /api/analytics/agents` - Get agent performance (protected)

### Canned Responses
- `GET /api/canned-responses` - List canned responses (protected)
- `GET /api/canned-responses/:id` - Get single response (protected)
- `POST /api/canned-responses` - Create response (protected)
- `PUT /api/canned-responses/:id` - Update response (protected)
- `DELETE /api/canned-responses/:id` - Delete response (protected)

## Socket.io Events

### Agent Events
- `agent:connect` - Agent connects
- `agent:online` - Agent comes online
- `agent:offline` - Agent goes offline

### Visitor Events
- `visitor:connect` - Visitor connects
- `visitor:connected` - Visitor connection confirmed
- `visitor:online` - Visitor comes online
- `visitor:offline` - Visitor goes offline

### Conversation Events
- `conversation:start` - Start new conversation
- `conversation:created` - Conversation created
- `conversation:new` - New conversation notification
- `conversation:join` - Join conversation room

### Message Events
- `message:send` - Send message
- `message:new` - New message received
- `message:read` - Mark message as read

### Typing Events
- `typing:start` - User starts typing
- `typing:stop` - User stops typing

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Visitor.js        # Visitor model
│   │   ├── Conversation.js   # Conversation model
│   │   ├── Message.js        # Message model
│   │   └── CannedResponse.js # Canned response model
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── conversations.js  # Conversation routes
│   │   ├── messages.js       # Message routes
│   │   ├── visitors.js       # Visitor routes
│   │   ├── analytics.js      # Analytics routes
│   │   └── cannedResponses.js # Canned response routes
│   ├── socket/
│   │   └── chatHandler.js    # Socket.io chat handler
│   └── app.js                # Main application file
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── Dockerfile                # Docker configuration
└── README.md                 # This file
```

## Docker Deployment

Build and run with Docker:

```bash
docker build -t livechat-backend .
docker run -p 5000:5000 --env-file .env livechat-backend
```

## License

MIT
