# 🚀 Quick Start Guide

Get LiveChat Clone up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally (or use Docker)

## Option 1: Quick Local Setup (Recommended for Development)

### Step 1: Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/livechat-clone.git
cd livechat-clone

# Install all dependencies at once
npm run install:all
```

### Step 3: Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# The default settings work for local development!
cd ..

# Dashboard
cd dashboard
cp .env.example .env
# The default settings work for local development!
cd ..
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

Wait for the message: `Server running in development mode on port 5000`

**Terminal 2 - Dashboard:**
```bash
npm run dev:dashboard
```

The dashboard will open automatically at `http://localhost:3000`

### Step 5: Create Your First User

1. Navigate to `http://localhost:3000/register`
2. Fill in the form:
   - Name: Admin User
   - Email: admin@example.com
   - Password: password123
3. Click "Create Account"
4. You'll be automatically logged in!

### Step 6: Test the Widget

```bash
# Terminal 3 - Build widget
npm run build:widget

# Serve the widget demo
cd widget
npx serve .
```

Open the URL shown (usually `http://localhost:3000` or another port) and click the chat button!

## Option 2: Docker Setup (Easiest)

```bash
# Clone the repository
git clone https://github.com/yourusername/livechat-clone.git
cd livechat-clone

# Start everything with Docker Compose
docker-compose up -d

# Wait about 30 seconds for services to start
docker-compose ps
```

Access:
- Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

Create a user by registering at http://localhost:3000/register

## What's Next?

### Explore the Dashboard

- **Conversations**: View and manage customer chats
- **Analytics**: See performance metrics and statistics
- **Settings**: Customize your profile and preferences

### Test Real-time Chat

1. Keep the dashboard open in one browser tab
2. Open `widget/demo.html` in another tab (after building the widget)
3. Start a chat from the widget
4. Watch it appear instantly in the dashboard!

### API Testing

```bash
# Login and get a token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Use the token to access protected endpoints
curl -X GET http://localhost:5000/api/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Or change PORT in backend/.env
PORT=5001
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If not, start it
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb
```

### Widget Not Loading
```bash
# Rebuild the widget
cd widget
npm run build
```

## File Structure Overview

```
livechat-clone/
├── backend/        # Node.js API server with Socket.io
├── dashboard/      # React agent dashboard
├── widget/         # Embeddable chat widget
└── README.md       # Full documentation
```

## Default Credentials

After registration, you can use:
- Email: admin@example.com (or whatever you registered with)
- Password: password123 (or whatever you set)

## URLs

- Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## Features to Try

✅ **Authentication**: Login/Logout with JWT  
✅ **Real-time Chat**: Instant messaging with Socket.io  
✅ **Conversations**: Assign, transfer, resolve, and close chats  
✅ **Analytics**: View conversation statistics  
✅ **Status Management**: Set your availability (online, away, busy)  
✅ **Canned Responses**: Quick replies for common questions  
✅ **Visitor Tracking**: See visitor information and history  
✅ **Rating System**: Collect customer feedback  

## Need Help?

- 📖 Read the full [README.md](./README.md)
- 🧪 Check the [TESTING.md](./TESTING.md) guide
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

## Stopping the Application

### Local Setup
Press `Ctrl+C` in each terminal running the services

### Docker
```bash
docker-compose down
```

---

**Congratulations! 🎉** You now have a fully functional LiveChat application running!

Start exploring the features and customize it for your needs.
