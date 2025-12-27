# 🚀 LiveChat Clone - Complete Setup Guide

This guide will help you set up and run the LiveChat Clone application on your local machine.

## 🎯 Quick Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  LiveChat Clone Setup Flow                   │
└─────────────────────────────────────────────────────────────┘

1. ✅ Install Prerequisites (Node.js, MongoDB, Git)
         ↓
2. 📥 Clone Repository & Install Dependencies
         ↓
3. ⚙️  Setup Environment Files (.env)
         ↓
4. 🌱 Seed Database (Optional - adds demo data)
         ↓
5. 🚀 Start Services (Backend → Dashboard → Widget)
         ↓
6. 🎉 Access at http://localhost:3000
```

**Estimated Time:** 15-20 minutes (first time setup)

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have the following installed on your computer:

### Required Software:
- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (version 4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/downloads)

### Check if you have them installed:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
mongod --version  # Should show version 4.4 or higher
git --version     # Should show git version
```

---

## Installation

### Step 1: Clone the Repository

Open your terminal/command prompt and run:

```bash
git clone https://github.com/AbdulAzeem09/livechat-clone.git
cd livechat-clone
```

### Step 2: Install MongoDB and Start It

#### For Windows:
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically as a service

#### For macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### For Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 3: Install Dependencies

Run this command in the root directory:

```bash
npm run install:all
```

This will install all dependencies for backend, dashboard, and widget.

### Step 4: Setup Environment Variables

#### Backend Setup:
```bash
cd backend
cp .env.example .env
```

The `.env` file should contain (default values are good for local development):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

#### Dashboard Setup:
```bash
cd ../dashboard
cp .env.example .env
```

The `.env` file should contain:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 5: Seed the Database (Optional but Recommended)

This will add demo users and sample data:

```bash
cd ../backend
npm run seed
```

Demo credentials after seeding:
- Email: demo@livechat.com
- Password: demo123

---

## Running the Application

You need to run **three separate services** in different terminal windows:

### Terminal 1: Start Backend Server

```bash
# From the root directory
cd backend
npm run dev
```

Wait for: ✅ `Server running in development mode on port 5000`

### Terminal 2: Start Dashboard (React App)

```bash
# From the root directory
cd dashboard
npm start
```

Wait for: ✅ Dashboard opens automatically at `http://localhost:3000`

### Terminal 3: Build Widget (Optional)

```bash
# From the root directory
cd widget
npm run build
```

This builds the embeddable chat widget that can be added to any website.

---

## Testing

### Test the Dashboard:

1. Open browser and go to: `http://localhost:3000`
2. Click "Register" if you haven't seeded the database
3. Or login with demo credentials:
   - Email: demo@livechat.com
   - Password: demo123

### Test the API:

```bash
# Health check
curl http://localhost:5000/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@livechat.com","password":"demo123"}'
```

### Test the Widget:

1. After building the widget, open `widget/demo.html` in your browser
2. Click the chat button in the bottom-right corner
3. Start a conversation
4. You should see it appear in the dashboard!

---

## Troubleshooting

### Problem: Port 5000 is already in use

**Solution 1:** Kill the process using port 5000
```bash
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Solution 2:** Change the port in `backend/.env`
```
PORT=5001
```

And update `dashboard/.env`:
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_SOCKET_URL=http://localhost:5001
```

### Problem: Cannot connect to MongoDB

**Check if MongoDB is running:**
```bash
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongodb

# Windows:
services.msc (look for MongoDB)
```

**Start MongoDB if not running:**
```bash
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb

# Windows: Start MongoDB service from services.msc
```

### Problem: Module not found errors

**Solution:** Reinstall dependencies
```bash
# From root directory
npm run install:all
```

Or install individually:
```bash
cd backend && npm install
cd ../dashboard && npm install
cd ../widget && npm install
```

### Problem: Dashboard won't start

**Solution:** Clear cache and reinstall
```bash
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problem: CORS errors in browser

**Solution:** Check `backend/.env` has correct CORS_ORIGIN:
```
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

---

## Alternative: Using Docker 🐳

If you have Docker installed, you can run everything with one command:

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- Dashboard on port 3000

Access the dashboard at: http://localhost:3000

To stop:
```bash
docker-compose down
```

---

## Quick Reference

### Useful Commands:

```bash
# Install all dependencies
npm run install:all

# Start backend
npm run dev:backend

# Start dashboard
npm run dev:dashboard

# Build widget
npm run build:widget

# Seed database
cd backend && npm run seed

# Check MongoDB status
mongosh  # Opens MongoDB shell
```

### Important URLs:
- Dashboard: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health
- MongoDB: mongodb://localhost:27017

### Default Ports:
- Frontend Dashboard: 3000
- Backend API: 5000
- MongoDB: 27017

---

## Next Steps

After successfully running the application:

1. ✅ Explore the dashboard features
2. ✅ Test real-time chat functionality
3. ✅ Try the widget on a demo page
4. ✅ Read full documentation in [README.md](./README.md)
5. ✅ Check advanced features in [FEATURES.md](./FEATURES.md)

---

## Need More Help?

- 📖 Read the [README.md](./README.md) for complete documentation
- 🚀 Check [QUICKSTART.md](./QUICKSTART.md) for quick tips
- 🧪 See [TESTING.md](./TESTING.md) for testing guides
- 🏗️ Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- 🐛 Report issues on [GitHub Issues](https://github.com/AbdulAzeem09/livechat-clone/issues)

---

**Happy Coding! 🎉**
