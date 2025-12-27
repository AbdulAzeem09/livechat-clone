# Quick Start Guide

This guide will help you get LiveChat Clone up and running quickly.

## Prerequisites

Make sure you have the following installed:
- Node.js 18+ and npm
- MongoDB 6.0+
- Redis (optional but recommended)

## Option 1: Quick Start with Docker (Recommended)

### 1. Clone the repository
```bash
git clone https://github.com/AbdulAzeem09/livechat-clone.git
cd livechat-clone
```

### 2. Configure environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings (optional - defaults work for local development)
nano .env
```

### 3. Start with Docker Compose
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend API on port 5000

### 4. Check if services are running
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### 5. Test the API
```bash
# Health check
curl http://localhost:5000/health
```

### 6. Seed sample data
```bash
# Access backend container
docker-compose exec backend npm run seed
```

---

## Option 2: Manual Installation

### 1. Install MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS with Homebrew
brew install mongodb-community

# Start MongoDB
mongod
```

### 2. Install Redis (Optional)
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS with Homebrew
brew install redis

# Start Redis
redis-server
```

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Configure environment
```bash
# Copy example env file
cp ../.env.example .env

# Edit with your MongoDB and Redis URIs
nano .env
```

### 5. Start the backend
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

### 6. Seed sample data
```bash
npm run seed
```

---

## Verify Installation

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 10.5
}
```

### 2. Register a test user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "agent"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `token` from the response for authenticated requests.

### 4. Get current user
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Using Seed Data

After running the seed script, you can login with these accounts:

**Admin Account:**
- Email: `admin@livechat.com`
- Password: `admin123`

**Agent Accounts:**
- Email: `alice@livechat.com` / Password: `agent123`
- Email: `bob@livechat.com` / Password: `agent123`
- Email: `carol@livechat.com` / Password: `agent123`

The seed script also creates:
- 2 Departments (Sales, Technical Support)
- 5 Canned Responses
- 6 Tags
- Business Hours configuration
- Widget configuration

---

## Testing with Postman

### 1. Import Collection

Create a new Postman collection with these requests:

**Environment Variables:**
- `base_url`: `http://localhost:5000/api`
- `token`: (will be set after login)

**Requests:**

1. **Register**
   - POST `{{base_url}}/auth/register`
   - Body: JSON with name, email, password

2. **Login**
   - POST `{{base_url}}/auth/login`
   - Body: JSON with email, password
   - Save token from response to environment

3. **Get Current User**
   - GET `{{base_url}}/auth/me`
   - Header: `Authorization: Bearer {{token}}`

4. **Get Conversations**
   - GET `{{base_url}}/conversations`
   - Header: `Authorization: Bearer {{token}}`

5. **Get Dashboard Stats**
   - GET `{{base_url}}/analytics/dashboard`
   - Header: `Authorization: Bearer {{token}}`

---

## Testing WebSocket Connection

### Using Socket.io Client

Install Socket.io client:
```bash
npm install -g socket.io-client
```

Test connection:
```javascript
const io = require('socket.io-client');

// Agent connection
const agentSocket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN_HERE'
  }
});

agentSocket.on('connect', () => {
  console.log('Agent connected:', agentSocket.id);
});

agentSocket.on('message:receive', (data) => {
  console.log('Message received:', data);
});

// Send a message
agentSocket.emit('message:send', {
  conversationId: 'conv_id',
  content: 'Hello!',
  type: 'text'
});
```

### Using Browser Console

```javascript
<script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
<script>
  const socket = io('http://localhost:5000', {
    auth: {
      token: 'YOUR_JWT_TOKEN_HERE'
    }
  });
  
  socket.on('connect', () => {
    console.log('Connected:', socket.id);
  });
  
  socket.on('message:receive', (data) => {
    console.log('Message:', data);
  });
</script>
```

---

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running:
```bash
sudo systemctl start mongod
# or
mongod --dbpath /path/to/data
```

### Redis Connection Warning
```
WARN: Redis Client Error
```
**Solution:** Redis is optional. Either install and start Redis, or ignore the warning. The app will work without Redis.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in .env file or kill the process using port 5000:
```bash
# Find process
lsof -i :5000
# Kill process
kill -9 <PID>
```

### JWT Token Expired
```
Error: Token expired
```
**Solution:** Use the refresh token endpoint to get a new access token:
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

## Stopping the Application

### Docker
```bash
# Stop containers
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers with volumes
docker-compose down -v
```

### Manual
```bash
# Press Ctrl+C in the terminal running the app
# Or kill the process
pkill -f "node.*app.js"
```

---

## Next Steps

1. **Explore the API**: Check `API_DOCUMENTATION.md` for all available endpoints
2. **Set up integrations**: See `INTEGRATION_GUIDE.md` for third-party setup
3. **Build frontend**: The backend is ready for your React dashboard and widget
4. **Deploy**: Use Docker Compose for production deployment

---

## Getting Help

- Check the documentation files in the repository
- Review the code comments for implementation details
- Open an issue on GitHub for bugs or questions

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET to strong random values
- [ ] Set NODE_ENV=production
- [ ] Use a secure MongoDB connection (authentication enabled)
- [ ] Configure Redis for session management
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB
- [ ] Review and adjust rate limiting settings
- [ ] Set up environment-specific configuration
- [ ] Test all integrations in staging environment
