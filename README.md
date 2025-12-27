# 🚀 LiveChat Clone - Complete Customer Support Application

A production-ready, full-featured customer support chat application similar to LiveChat.com, built with the MERN stack (MongoDB, Express, React, Node.js) and real-time communication via Socket.io.

![LiveChat Clone](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📖 Setup & Running Guides

**New to this project? Start here:**
- 🇬🇧 **[SETUP.md](./SETUP.md)** - Complete step-by-step setup guide (English)
- 🇵🇰 **[RUNNING_UR.md](./RUNNING_UR.md)** - چلانے کی مکمل گائیڈ (Urdu/اردو)
- ⚡ **[QUICKSTART.md](./QUICKSTART.md)** - Quick start in 5 minutes

## 🚀 One-Click Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/AbdulAzeem09/livechat-clone)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AbdulAzeem09/livechat-clone)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/AbdulAzeem09/livechat-clone)

## 🎯 Demo Credentials

After seeding the database, use these credentials to login:

- **Email:** demo@livechat.com
- **Password:** demo123

Additional test accounts:
- sarah@livechat.com / agent123
- mike@livechat.com / agent123

## ✨ Features

### Backend (Node.js + Express + Socket.io + MongoDB)

#### 🗄️ Database Models (12 total)
- ✅ **User** - Agents and administrators with role-based access
- ✅ **Visitor** - Website visitors with geolocation tracking and page view history
- ✅ **Conversation** - Chat sessions with status management
- ✅ **Message** - Individual messages with reactions, replies, edit/delete support
- ✅ **CannedResponse** - Quick reply templates
- ✅ **Department** - Agent organization and routing
- ✅ **Trigger** - Automated actions based on visitor behavior
- ✅ **Widget** - Embeddable chat widget configurations
- ✅ **Webhook** - External integrations with retry logic
- ✅ **Tag** - Conversation categorization
- ✅ **BusinessHours** - Operating hours configuration
- ✅ **AuditLog** - System activity tracking

#### 🔐 Authentication & Security
- ✅ JWT-based authentication with refresh token support
- ✅ Role-based access control (agent, admin, super_admin)
- ✅ Password hashing with bcryptjs
- ✅ Security middleware (helmet, CORS)
- ✅ Input validation with express-validator

#### 💬 Real-time Features
- ✅ Socket.io WebSocket communication
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Message reactions with emojis
- ✅ Message replies (threading)
- ✅ Message edit/delete
- ✅ Online/offline status
- ✅ Agent availability management

#### 📊 Advanced Features
- ✅ Visitor geolocation tracking
- ✅ Page view tracking
- ✅ Trigger-based automation
- ✅ Agent assignment (round-robin, load balancing, skill-based)
- ✅ Conversation transfer between agents
- ✅ Analytics aggregation and reporting
- ✅ Webhook system with automatic retry
- ✅ Multi-department support
- ✅ Business hours scheduling
- ✅ Conversation rating system

#### 🔌 Integration Services (API Ready)
- ✅ **aiService.js** - OpenAI integration for AI-powered responses
- ✅ **whatsappService.js** - WhatsApp Business API integration
- ✅ **facebookService.js** - Facebook Messenger integration
- ✅ **telegramService.js** - Telegram Bot API integration
- ✅ **emailService.js** - Email notifications and transcripts
- ✅ **smsService.js** - SMS notifications via Twilio

#### 🌐 REST API Endpoints (65+ total)
**Authentication** (5 endpoints)
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile
- PUT /api/auth/status - Update user status
- POST /api/auth/logout - Logout user

**Conversations** (8 endpoints)
- GET /api/conversations - List conversations with filters
- GET /api/conversations/:id - Get conversation details
- POST /api/conversations - Create conversation
- PUT /api/conversations/:id/assign - Assign to agent
- PUT /api/conversations/:id/transfer - Transfer to another agent
- PUT /api/conversations/:id/resolve - Mark as resolved
- PUT /api/conversations/:id/close - Close conversation
- PUT /api/conversations/:id/rate - Rate conversation

**Messages** (8 endpoints)
- GET /api/messages/:conversationId - Get messages
- POST /api/messages - Send message
- PUT /api/messages/:id/read - Mark as read
- PUT /api/messages/conversation/:conversationId/read-all - Mark all as read
- POST /api/messages/:id/react - Add/remove reaction
- PUT /api/messages/:id/edit - Edit message
- DELETE /api/messages/:id - Delete message

**Visitors** (4 endpoints)
- GET /api/visitors - List visitors
- GET /api/visitors/:id - Get visitor details
- PUT /api/visitors/:id - Update visitor
- POST /api/visitors - Create visitor

**Analytics** (4 endpoints)
- GET /api/analytics/overview - Overview statistics
- GET /api/analytics/charts - Chart data
- GET /api/analytics/agents - Agent performance
- GET /api/analytics/reports - Generate reports

**Canned Responses** (5 endpoints)
- GET /api/canned-responses - List responses
- GET /api/canned-responses/:id - Get response
- POST /api/canned-responses - Create response
- PUT /api/canned-responses/:id - Update response
- DELETE /api/canned-responses/:id - Delete response

**Departments** (7 endpoints)
- GET /api/departments - List departments
- GET /api/departments/:id - Get department
- POST /api/departments - Create department
- PUT /api/departments/:id - Update department
- DELETE /api/departments/:id - Delete department
- POST /api/departments/:id/agents - Add agent
- DELETE /api/departments/:id/agents/:agentId - Remove agent

**Tags** (5 endpoints)
- GET /api/tags - List tags
- GET /api/tags/:id - Get tag
- POST /api/tags - Create tag
- PUT /api/tags/:id - Update tag
- DELETE /api/tags/:id - Delete tag

**Webhooks** (6 endpoints)
- GET /api/webhooks - List webhooks
- GET /api/webhooks/:id - Get webhook
- POST /api/webhooks - Create webhook
- PUT /api/webhooks/:id - Update webhook
- DELETE /api/webhooks/:id - Delete webhook
- POST /api/webhooks/:id/test - Test webhook

**Triggers** (6 endpoints)
- GET /api/triggers - List triggers
- GET /api/triggers/active - Get active triggers
- GET /api/triggers/:id - Get trigger
- POST /api/triggers - Create trigger
- PUT /api/triggers/:id - Update trigger
- PUT /api/triggers/:id/toggle - Toggle active status

**Widgets** (6 endpoints)
- GET /api/widgets - List widgets
- GET /api/widgets/:id - Get widget
- POST /api/widgets - Create widget
- PUT /api/widgets/:id - Update widget
- DELETE /api/widgets/:id - Delete widget
- PUT /api/widgets/:id/toggle - Toggle active status

**Business Hours** (5 endpoints)
- GET /api/business-hours - List all
- GET /api/business-hours/default - Get default
- GET /api/business-hours/:id - Get by ID
- POST /api/business-hours - Create
- PUT /api/business-hours/:id - Update

### Dashboard (React + Tailwind CSS)

#### 🎨 Design System (LiveChat.com Inspired)
- ✅ **Primary Color:** #FF5100 (LiveChat Orange)
- ✅ **Font:** Source Sans Pro
- ✅ **Layout:** 3-panel responsive design
- ✅ **Dark Mode:** Supported with class-based toggling
- ✅ **Animations:** Smooth transitions and micro-interactions

#### 📱 Components & Pages
- ✅ **Authentication:** Login, Register with validation
- ✅ **TopNav:** 56px height with logo, navigation, status selector
- ✅ **ConversationList:** Search, filters, conversation items with unread badges
- ✅ **ChatWindow:** Message display, typing indicator, rich text input
- ✅ **VisitorDetails:** Collapsible sections with visitor info, history, notes
- ✅ **Analytics Dashboard:** Statistics cards, charts, performance metrics
- ✅ **Settings:** Profile management, preferences, team settings
- ✅ **Canned Responses:** Quick reply management interface
- ✅ **Department Management:** Team organization interface
- ✅ **Tag Management:** Conversation categorization tools

#### ⚡ Features
- ✅ Real-time message updates via Socket.io
- ✅ Conversation filters (all, pending, active, resolved)
- ✅ Typing indicators for both agents and visitors
- ✅ Status management (online, away, busy, offline)
- ✅ Message reactions with emoji picker
- ✅ Message edit and delete functionality
- ✅ File attachment UI (ready for implementation)
- ✅ Canned responses dropdown with shortcuts
- ✅ Visitor information panel with detailed tracking
- ✅ Notes and tags functionality
- ✅ Analytics with trend charts
- ✅ Protected routes with authentication
- ✅ Toast notifications for user feedback
- ✅ Responsive design for all screen sizes

### Widget (Embeddable Chat)
- ✅ **Launcher:** 60x60px floating button with gradient design
- ✅ **Chat Window:** 380x600px responsive window
- ✅ **Pre-chat Form:** Customizable visitor information collection
- ✅ **Rating System:** 5-star post-chat rating
- ✅ **Animations:** Slide-up entrance animation
- ✅ **Notifications:** Sound alerts for new messages
- ✅ Real-time messaging with Socket.io
- ✅ Typing indicators
- ✅ Unread message badge
- ✅ Auto-reconnect on disconnect
- ✅ Mobile responsive design
- ✅ Easy integration with any website
- ✅ Customizable colors and branding

## 🏗️ Project Structure

```
livechat-clone/
├── backend/                    # Node.js API Server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── middleware/        # Authentication middleware
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── socket/            # Socket.io handlers
│   │   └── app.js             # Main application file
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
│
├── dashboard/                  # React Agent Dashboard
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React context (Auth)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API and Socket services
│   │   ├── App.jsx            # Main App component
│   │   └── index.js           # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── widget/                     # Embeddable Chat Widget
│   ├── src/
│   │   ├── Widget.jsx         # Main widget component
│   │   ├── index.js           # Entry point
│   │   └── styles.css         # Widget styles
│   ├── package.json
│   └── webpack.config.js
│
├── docker-compose.yml          # Docker orchestration
├── .gitignore
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/livechat-clone.git
   cd livechat-clone
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Seed the database with demo data
   npm run seed
   
   # Start the server
   npm run dev
   ```

3. **Setup Dashboard** (in a new terminal)
   ```bash
   cd dashboard
   npm install
   cp .env.example .env
   # Edit .env with your backend API URL
   npm start
   ```

4. **Setup Widget** (optional)
   ```bash
   cd widget
   npm install
   npm run build
   ```

## 🐳 Docker Deployment

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Dashboard on port 3000

## ☁️ Cloud Deployment Options

### Railway
1. Click the "Deploy on Railway" button above
2. Configure environment variables
3. Deploy automatically

### Render
1. Click the "Deploy to Render" button above
2. Connect your repository
3. Configure services from render.yaml
4. Deploy with one click

### Vercel (Dashboard Only)
```bash
cd dashboard
vercel deploy
```
Configure environment variables:
- `REACT_APP_API_URL`
- `REACT_APP_SOCKET_URL`

### Netlify (Dashboard Only)
```bash
cd dashboard
netlify deploy --prod
```
Configuration is in `netlify.toml`

### GitHub Codespaces
1. Click "Open in GitHub Codespaces" button
2. Wait for environment to build
3. Ports 3000, 5000, and 27017 will auto-forward
4. Database is seeded automatically

### AWS / GCP / Azure
1. Use Docker Compose for container orchestration
2. Deploy MongoDB using managed service (MongoDB Atlas)
3. Deploy backend and dashboard containers
4. Configure environment variables
5. Set up load balancer and SSL certificates

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Dashboard (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🔌 Widget Integration

To add the chat widget to your website:

1. Build the widget:
   ```bash
   cd widget
   npm run build
   ```

2. Add to your HTML:
   ```html
   <script src="path/to/widget.js"></script>
   <script>
     LiveChatWidget.init({
       apiUrl: 'http://localhost:5000'
     });
   </script>
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/status` - Update user status (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Conversation Endpoints

- `GET /api/conversations` - List all conversations (protected)
- `GET /api/conversations/:id` - Get conversation details (protected)
- `PUT /api/conversations/:id/assign` - Assign conversation (protected)
- `PUT /api/conversations/:id/transfer` - Transfer conversation (protected)
- `PUT /api/conversations/:id/resolve` - Mark as resolved (protected)
- `PUT /api/conversations/:id/close` - Close conversation (protected)
- `PUT /api/conversations/:id/rate` - Rate conversation (public)

### Message Endpoints

- `GET /api/messages/:conversationId` - Get messages (protected)
- `POST /api/messages` - Send message (protected)
- `PUT /api/messages/:id/read` - Mark as read (protected)
- `PUT /api/messages/conversation/:conversationId/read-all` - Mark all as read (protected)

### Visitor Endpoints

- `GET /api/visitors` - List visitors (protected)
- `GET /api/visitors/:id` - Get visitor details (protected)
- `PUT /api/visitors/:id` - Update visitor (protected)

### Analytics Endpoints

- `GET /api/analytics/overview` - Get overview stats (protected)
- `GET /api/analytics/charts` - Get chart data (protected)
- `GET /api/analytics/agents` - Get agent performance (protected)

### Canned Response Endpoints

- `GET /api/canned-responses` - List canned responses (protected)
- `GET /api/canned-responses/:id` - Get single response (protected)
- `POST /api/canned-responses` - Create response (protected)
- `PUT /api/canned-responses/:id` - Update response (protected)
- `DELETE /api/canned-responses/:id` - Delete response (protected)

## 🔐 Socket.io Events

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

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Socket.io, MongoDB, Mongoose
- **Frontend**: React 18, React Router DOM 6, Tailwind CSS 3
- **Real-time**: Socket.io-client
- **Authentication**: JWT (jsonwebtoken, bcryptjs)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Formatting**: date-fns
- **Build Tools**: Webpack, Babel
- **DevOps**: Docker, Docker Compose

## 🎯 Default User

After setting up, you can create a user via the registration page or use the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

## 📱 Screenshots

### Dashboard
The agent dashboard provides a clean interface for managing conversations with real-time updates.

### Widget
The embeddable widget can be added to any website with a single script tag.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by LiveChat.com
- Built with modern web technologies
- Designed for scalability and performance

## 📧 Support

For support, email support@example.com or create an issue in this repository.

## 🔮 Future Enhancements

- [ ] File upload support
- [ ] Voice and video calls
- [ ] Advanced analytics with charts
- [ ] Multi-language support
- [ ] Mobile apps (React Native)
- [ ] Email notifications
- [ ] Chat bot integration
- [ ] Integration with third-party services (Slack, etc.)
- [ ] Advanced visitor tracking (page views, time on site)
- [ ] Team collaboration features
- [ ] Custom branding options

---

Made with ❤️ by the LiveChat Clone Team
