# 🚀 LiveChat Clone - Complete Customer Support Application

A full-featured customer support chat application similar to LiveChat.com, built with the MERN stack (MongoDB, Express, React, Node.js) and real-time communication via Socket.io.

![LiveChat Clone](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Backend (Node.js + Express + Socket.io + MongoDB)
- ✅ JWT-based authentication with role-based access control
- ✅ Real-time chat with Socket.io
- ✅ RESTful API endpoints for all operations
- ✅ MongoDB database with Mongoose ODM
- ✅ User status management (online, offline, away, busy)
- ✅ Conversation management (assign, transfer, resolve, close)
- ✅ Message delivery tracking and read receipts
- ✅ Visitor tracking and management
- ✅ Analytics and reporting dashboard
- ✅ Canned responses for quick replies
- ✅ Typing indicators
- ✅ Conversation rating system

### Dashboard (React + Tailwind CSS)
- ✅ Beautiful, modern UI with Tailwind CSS
- ✅ Authentication pages (login, register)
- ✅ Real-time conversation updates
- ✅ Conversation list with filters (all, pending, active, resolved)
- ✅ Chat window with message history
- ✅ Visitor information panel
- ✅ Analytics dashboard with charts
- ✅ Settings page for profile management
- ✅ Canned responses management
- ✅ Typing indicators
- ✅ Status management for agents
- ✅ Protected routes

### Widget (Embeddable Chat)
- ✅ Floating chat button
- ✅ Pre-chat form for visitor information
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Post-chat rating system
- ✅ Unread message badge
- ✅ Mobile responsive design
- ✅ Auto-reconnect on disconnect
- ✅ Easy to embed on any website

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
