# LiveChat Dashboard

React-based agent dashboard for the LiveChat Clone application.

> 📖 **New to this project?** Check out the main setup guides:
> - [Complete Setup Guide](../SETUP.md) - Step-by-step installation
> - [Urdu Guide](../RUNNING_UR.md) - اردو میں گائیڈ
> - [Quick Start](../QUICKSTART.md) - Get started in 5 minutes
> - [Command Cheatsheet](../CHEATSHEET.md) - Quick reference

## Features

- Real-time conversation management
- Multi-agent support with online status
- Typing indicators and read receipts
- Message reactions and replies
- Canned responses for quick replies
- Visitor tracking and analytics
- Department management
- Tag and categorization system
- Responsive design for all devices

## Tech Stack

- React 18
- React Router DOM 6
- Socket.io-client for real-time communication
- Tailwind CSS 3 for styling
- Axios for API calls
- Lucide React for icons
- React Hot Toast for notifications

## Quick Start

### Prerequisites

- Node.js 18+
- Backend API running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

3. Start development server:
```bash
npm start
```

The dashboard will open at http://localhost:3000

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)
- `REACT_APP_SOCKET_URL` - Socket.io server URL (default: http://localhost:5000)

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## Project Structure

```
dashboard/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   ├── ConversationList.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── VisitorDetails.jsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   ├── context/         # React context
│   │   └── AuthContext.jsx
│   ├── services/        # API and Socket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── App.jsx          # Main App component
│   └── index.js         # Entry point
├── .env.example         # Environment template
├── package.json
└── tailwind.config.js   # Tailwind configuration
```

## Key Components

### Authentication
- Login/Register pages with form validation
- JWT-based authentication
- Protected routes

### Conversation Management
- Real-time conversation list with filters
- Search functionality
- Unread message badges
- Status indicators

### Chat Interface
- Message display with timestamps
- Typing indicators
- Message reactions
- Edit/delete functionality
- File attachment UI

### Visitor Panel
- Visitor information display
- Page view history
- Notes and tags
- Geolocation data

### Analytics
- Overview statistics
- Performance charts
- Agent metrics

## Customization

### Theming

Colors are defined in `tailwind.config.js`. The primary color is LiveChat Orange (#FF5100).

### Font

The app uses Source Sans Pro. You can change it in `tailwind.config.js`.

## Troubleshooting

### Port 3000 already in use

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or set a different port:
```bash
PORT=3001 npm start
```

### Cannot connect to backend

1. Make sure backend is running on port 5000
2. Check `.env` file has correct API URLs
3. Verify CORS settings in backend

### Build errors

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## Deployment

### Vercel

```bash
vercel deploy
```

Configure environment variables in Vercel dashboard.

### Netlify

```bash
netlify deploy --prod
```

Configuration is in `netlify.toml`.

### Docker

Build and run with Docker:

```bash
docker build -t livechat-dashboard .
docker run -p 3000:3000 livechat-dashboard
```

## Need Help?

- Check the [main documentation](../README.md)
- Review [setup guide](../SETUP.md)
- See [troubleshooting](../SETUP.md#troubleshooting)
- Report issues on GitHub

---

Built with ❤️ using React and Tailwind CSS
