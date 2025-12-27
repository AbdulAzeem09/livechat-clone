# LiveChat Clone - Testing Guide

This guide will help you test all components of the LiveChat Clone application.

## Prerequisites

Before testing, ensure you have:
- Node.js 18+ installed
- MongoDB 4.4+ installed and running (or use Docker)
- npm or yarn package manager

## Setup Instructions

### 1. Install MongoDB (if not using Docker)

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
sudo systemctl enable mongodb
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### 2. Backend Setup & Testing

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file (optional - defaults work for local testing)
# Update MONGODB_URI if needed

# Start the backend server
npm run dev
```

The backend should now be running on `http://localhost:5000`

**Test Backend Health:**
```bash
# In a new terminal
curl http://localhost:5000/health
# Expected output: {"status":"ok","message":"LiveChat API is running"}
```

**Test User Registration:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Agent",
    "email": "agent@test.com",
    "password": "password123",
    "role": "agent"
  }'
```

Expected output should include a token and user object.

**Test User Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "agent@test.com",
    "password": "password123"
  }'
```

Save the token from the response for authenticated requests.

### 3. Dashboard Setup & Testing

```bash
# Navigate to dashboard directory (in a new terminal)
cd dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the dashboard
npm start
```

The dashboard should open automatically in your browser at `http://localhost:3000`

**Manual Testing:**

1. **Registration:**
   - Navigate to `http://localhost:3000/register`
   - Fill in the form with a name, email, and password
   - Click "Create Account"
   - You should be redirected to the dashboard

2. **Login:**
   - Navigate to `http://localhost:3000/login`
   - Enter your credentials
   - Click "Sign In"
   - You should be redirected to the dashboard

3. **Dashboard Features:**
   - Verify the sidebar navigation works
   - Check that status dropdown shows (online, away, busy, offline)
   - Navigate to Analytics page
   - Navigate to Settings page
   - Test logout functionality

4. **Conversation Management:**
   - The conversation list should be empty initially
   - Use the widget (see below) to create a conversation
   - Once a conversation appears, click on it
   - Test sending messages
   - Test the visitor info panel on the right

### 4. Widget Setup & Testing

```bash
# Navigate to widget directory (in a new terminal)
cd widget

# Install dependencies
npm install

# Build the widget
npm run build
```

**Test the Widget:**

1. Open the demo page:
   ```bash
   # Serve the widget directory
   npx serve .
   ```
   
2. Open `http://localhost:3000` (or the port shown) in your browser

3. **Widget Testing:**
   - Click the chat button in the bottom-right corner
   - Fill in the pre-chat form:
     - Name: Test Visitor
     - Email: visitor@test.com
     - Message: Hello, I need help
   - Click "Start Chat"
   - Send a few messages
   - Check if messages appear in the dashboard (keep both tabs open)
   - Test typing indicators
   - Close the chat and rate the conversation

### 5. Real-time Communication Testing

To test the full real-time experience:

1. **Open the dashboard in one browser tab:**
   - Login as an agent
   - Navigate to the Dashboard (Conversations view)

2. **Open the widget demo in another tab:**
   - Click the chat button
   - Fill in the pre-chat form
   - Start chatting

3. **Verify real-time features:**
   - New conversation appears immediately in dashboard
   - Messages from visitor appear in dashboard instantly
   - Messages from agent appear in widget instantly
   - Typing indicators work in both directions
   - Conversation status updates work

### 6. Docker Testing

If you prefer to use Docker:

```bash
# From the root directory
docker compose up -d

# Check if services are running
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f dashboard

# Stop services
docker compose down
```

Access the services:
- Backend API: `http://localhost:5000`
- Dashboard: `http://localhost:3000`
- MongoDB: `localhost:27017`

## API Testing with cURL

### Get All Conversations
```bash
# Replace YOUR_TOKEN with the token from login
curl -X GET http://localhost:5000/api/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Analytics Overview
```bash
curl -X GET http://localhost:5000/api/analytics/overview \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Canned Response
```bash
curl -X POST http://localhost:5000/api/canned-responses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome Message",
    "content": "Hello! How can I help you today?",
    "category": "Greeting"
  }'
```

## Testing Checklist

### Backend ✅
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] User registration works
- [ ] User login works
- [ ] JWT authentication works
- [ ] Protected routes require authentication
- [ ] Socket.io connection established

### Dashboard ✅
- [ ] App builds without errors
- [ ] Registration page works
- [ ] Login page works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Dashboard loads successfully
- [ ] Sidebar navigation works
- [ ] Conversation list displays
- [ ] Chat window works
- [ ] Visitor info panel displays
- [ ] Analytics page loads
- [ ] Settings page works
- [ ] Logout works
- [ ] Status changes work

### Widget ✅
- [ ] Widget builds successfully
- [ ] Chat button displays
- [ ] Pre-chat form works
- [ ] Messages can be sent
- [ ] Messages received from agent display
- [ ] Typing indicators work
- [ ] Unread badge shows
- [ ] Rating form appears
- [ ] Widget is responsive on mobile

### Real-time Features ✅
- [ ] New conversations appear instantly
- [ ] New messages appear instantly
- [ ] Typing indicators work both ways
- [ ] Agent status updates propagate
- [ ] Visitor online/offline status updates

## Common Issues & Solutions

### MongoDB Connection Failed
- **Issue:** `MongoServerError: connect ECONNREFUSED`
- **Solution:** Ensure MongoDB is running: `sudo systemctl start mongodb` or `brew services start mongodb-community`

### Port Already in Use
- **Issue:** `Error: listen EADDRINUSE: address already in use :::5000`
- **Solution:** Kill the process using the port or change the PORT in .env file

### CORS Errors in Browser
- **Issue:** CORS policy blocking requests
- **Solution:** Check CORS_ORIGIN in backend .env matches your frontend URL

### Widget Not Loading
- **Issue:** Widget.js not found or not loading
- **Solution:** Ensure you've run `npm run build` in the widget directory

### Socket.io Connection Failed
- **Issue:** WebSocket connection failed
- **Solution:** 
  - Check backend is running
  - Verify REACT_APP_SOCKET_URL in dashboard .env
  - Check firewall settings

## Performance Testing

### Load Testing (Optional)
You can use tools like Apache Bench or Artillery to test performance:

```bash
# Install Artillery
npm install -g artillery

# Create a simple test
cat > load-test.yml << EOF
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 5
scenarios:
  - flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "agent@test.com"
            password: "password123"
EOF

# Run the test
artillery run load-test.yml
```

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Mobile Testing

To test on mobile devices:

1. Find your local IP address:
   ```bash
   # On Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # On Windows
   ipconfig
   ```

2. Update the .env files to use your IP instead of localhost

3. Access from mobile device using: `http://YOUR_IP:3000`

## Debugging Tips

### Enable Debug Logs

**Backend:**
```javascript
// In src/app.js, add after morgan
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

**Socket.io:**
```javascript
// Set environment variable
DEBUG=socket.io* npm run dev
```

### Check Database
```bash
# Connect to MongoDB
mongosh

# Use the database
use livechat

# Check collections
show collections

# View users
db.users.find().pretty()

# View conversations
db.conversations.find().pretty()
```

## Production Deployment Testing

Before deploying to production:

1. Set `NODE_ENV=production` in backend
2. Update all URLs to production domains
3. Use strong JWT_SECRET
4. Enable HTTPS
5. Set up proper MongoDB authentication
6. Test with production build of dashboard: `npm run build`
7. Test all features end-to-end

## Automated Testing (Future Enhancement)

While not implemented yet, here's how you could add tests:

```bash
# Backend tests (Jest)
cd backend
npm install --save-dev jest supertest
npm test

# Dashboard tests (React Testing Library)
cd dashboard
npm test
```

## Support

If you encounter issues:
1. Check the logs in terminal
2. Check browser console for errors
3. Verify all services are running
4. Review this testing guide
5. Create an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

Happy Testing! 🚀
