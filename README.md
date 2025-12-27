# 🚀 LiveChat Clone

A full-featured customer support chat application.

## ⚡ Quick Deploy (No Setup Required!)

### One-Click Deploy Options:

| Platform | Type | Button |
|----------|------|--------|
| **Railway** | Full Stack | [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/AbdulAzeem09/livechat-clone) |
| **Render** | Full Stack | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/AbdulAzeem09/livechat-clone) |
| **Vercel** | Frontend | [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AbdulAzeem09/livechat-clone/tree/main/dashboard) |
| **Netlify** | Frontend | [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/AbdulAzeem09/livechat-clone) |

### GitHub Codespaces (Instant Dev Environment):
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/AbdulAzeem09/livechat-clone)

### Docker (Local Testing):
```bash
# One command to run everything!
docker-compose up -d

# Open in browser
# Dashboard: http://localhost:3000
# API: http://localhost:5000
```

## 🎮 Live Demo

After deploying, you'll get:
- **Dashboard URL**: Your agent panel
- **Widget Code**: Embed on any website

### Demo Credentials:
```
Email: demo@livechat.com
Password: demo123
```

---

## 📋 Features

- **Real-time Chat**: WebSocket-powered instant messaging
- **Agent Dashboard**: Manage conversations and visitors
- **Embeddable Widget**: Add chat to any website
- **Multi-agent Support**: Multiple agents can handle conversations
- **Conversation History**: View past interactions
- **User Management**: Admin and agent roles

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/AbdulAzeem09/livechat-clone.git
   cd livechat-clone
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI and JWT secret
   ```

4. **Start with Docker (Recommended)**
   ```bash
   npm run docker:up
   ```

   OR **Start manually**
   ```bash
   # Start backend and dashboard concurrently
   npm run dev
   ```

5. **Seed demo data (optional)**
   ```bash
   npm run seed
   ```

6. **Access the application**
   - Dashboard: http://localhost:3000
   - API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

---

## 📦 Project Structure

```
livechat-clone/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── server.js     # Main server file
│   │   └── seeds/        # Demo data scripts
│   ├── Dockerfile
│   └── package.json
├── dashboard/            # React dashboard
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── vercel.json       # Vercel config
│   ├── netlify.toml      # Netlify config
│   └── package.json
├── widget/               # Embeddable chat widget
│   ├── src/
│   └── package.json
├── .devcontainer/        # GitHub Codespaces config
├── docker-compose.yml    # Docker setup
├── railway.json          # Railway config
├── render.yaml           # Render config
└── package.json          # Root scripts
```

---

## 🚀 Deployment Guides

### Railway
1. Click the "Deploy on Railway" button above
2. Connect your GitHub account
3. Railway will automatically detect and deploy the app
4. Environment variables are auto-configured

### Render
1. Click the "Deploy to Render" button above
2. Render will create:
   - Backend service with MongoDB
   - Dashboard static site
3. **Important**: After deployment, update the dashboard environment variables:
   - Set `REACT_APP_API_URL` to your backend URL + `/api` (e.g., `https://your-backend.onrender.com/api`)
   - Set `REACT_APP_SOCKET_URL` to your backend URL (e.g., `https://your-backend.onrender.com`)
4. Other environment variables are auto-configured

### Vercel (Frontend Only)
1. Click the "Deploy with Vercel" button above
2. You'll need to deploy the backend separately
3. Update `REACT_APP_API_URL` environment variable

### Netlify (Frontend Only)
1. Click the "Deploy to Netlify" button above
2. You'll need to deploy the backend separately
3. Update `REACT_APP_API_URL` environment variable

### Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 📝 Available Scripts

```bash
npm run setup          # Install all dependencies
npm run dev            # Start development (backend + dashboard)
npm run build          # Build dashboard and widget
npm run docker:up      # Start with Docker
npm run docker:down    # Stop Docker containers
npm run seed           # Seed demo data
```

---

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/livechat
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

**⚠️ Security Note**: Always use strong, unique secrets in production. Never commit `.env` files with real credentials to version control.

**⚠️ Production Security Checklist**:
- Replace demo JWT_SECRET with a strong random secret
- Configure CORS_ORIGIN to allow only trusted domains (not wildcard `*`)
- Use HTTPS for all API endpoints
- Change default demo password if keeping demo accounts
- Regularly update dependencies for security patches

### Dashboard Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Support

If you find this project helpful, please give it a ⭐ on GitHub!
