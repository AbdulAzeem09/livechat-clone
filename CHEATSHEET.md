# 🚀 LiveChat Clone - Command Cheat Sheet

Quick reference for common commands and operations.

## 📦 Installation Commands

```bash
# Clone repository
git clone https://github.com/AbdulAzeem09/livechat-clone.git
cd livechat-clone

# Install all dependencies at once
npm run install:all

# Or install individually
cd backend && npm install
cd ../dashboard && npm install
cd ../widget && npm install
```

## ⚙️ Setup Commands

```bash
# Setup backend environment
cd backend
cp .env.example .env

# Setup dashboard environment
cd dashboard
cp .env.example .env

# Seed database with demo data
cd backend
npm run seed
```

## 🏃 Running Commands

```bash
# Start backend (Terminal 1)
npm run dev:backend
# OR
cd backend && npm run dev

# Start dashboard (Terminal 2)
npm run dev:dashboard
# OR
cd dashboard && npm start

# Build widget
npm run build:widget
# OR
cd widget && npm run build
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up -d --build
```

## 🗄️ MongoDB Commands

```bash
# Start MongoDB
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongodb

# Connect to MongoDB shell
mongosh

# Check MongoDB status
# macOS:
brew services list | grep mongodb

# Linux:
sudo systemctl status mongodb
```

## 🔍 Testing & Debugging Commands

```bash
# Check if ports are in use
# macOS/Linux:
lsof -i :3000  # Dashboard
lsof -i :5000  # Backend
lsof -i :27017 # MongoDB

# Windows:
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process on port
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
taskkill /PID <PID_NUMBER> /F

# Test API health
curl http://localhost:5000/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@livechat.com","password":"demo123"}'
```

## 🧹 Cleanup Commands

```bash
# Clean node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd dashboard
rm -rf node_modules package-lock.json
npm install

cd widget
rm -rf node_modules package-lock.json
npm install

# Clean build files
cd dashboard
rm -rf build

cd widget
rm -rf dist
```

## 📊 Version Check Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# Check Git version
git --version
```

## 🔑 Default Credentials

After seeding the database:

```
Email: demo@livechat.com
Password: demo123

Additional accounts:
- sarah@livechat.com / agent123
- mike@livechat.com / agent123
```

## 🌐 Default URLs

```
Dashboard: http://localhost:3000
Backend API: http://localhost:5000
API Health: http://localhost:5000/health
MongoDB: mongodb://localhost:27017
```

## 🔧 Common Environment Variables

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Dashboard (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🚨 Troubleshooting Quick Fixes

```bash
# Problem: Port already in use
# Fix: Change port in backend/.env
PORT=5001

# Problem: Cannot connect to MongoDB
# Fix: Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongodb           # Linux

# Problem: Module not found
# Fix: Reinstall dependencies
npm run install:all

# Problem: Build errors
# Fix: Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
```

## 📚 Useful npm Scripts

```bash
# Root package.json scripts
npm run install:all    # Install all dependencies
npm run dev:backend    # Start backend dev server
npm run dev:dashboard  # Start dashboard dev server
npm run build:widget   # Build widget for production
npm run build:all      # Build all production artifacts

# Backend scripts
cd backend
npm run dev            # Start with nodemon (auto-reload)
npm start              # Start production server
npm run seed           # Seed database with demo data
npm test               # Run tests

# Dashboard scripts
cd dashboard
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests

# Widget scripts
cd widget
npm run build          # Build widget bundle
npm run dev            # Start development mode
```

## 🔗 Quick Links

- 📖 [Complete Setup Guide](./SETUP.md)
- 🇵🇰 [Urdu Guide](./RUNNING_UR.md) - اردو گائیڈ
- ⚡ [Quick Start](./QUICKSTART.md)
- 📚 [Full Documentation](./README.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)
- ✨ [Features](./FEATURES.md)
- 🧪 [Testing Guide](./TESTING.md)

---

**Pro Tip:** Keep this file bookmarked for quick reference! 📌
