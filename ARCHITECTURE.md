# LiveChat Clone - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LiveChat Clone System                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐                                    ┌──────────────┐
│   Website    │                                    │   Dashboard  │
│   Visitor    │                                    │    Agent     │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │ Socket.io (WebSocket)                           │ Socket.io
       │ HTTPS REST API                                  │ HTTPS + WS
       │                                                  │
       ▼                                                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                        Backend Server                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │   Express  │  │  Socket.io │  │    JWT     │  │   Morgan   │ │
│  │   Router   │  │  Handler   │  │    Auth    │  │   Logger   │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     REST API Routes                        │  │
│  │  • /api/auth          • /api/conversations                 │  │
│  │  • /api/messages      • /api/visitors                      │  │
│  │  • /api/analytics     • /api/canned-responses              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   Mongoose Models                          │  │
│  │  • User           • Visitor       • Conversation           │  │
│  │  • Message        • CannedResponse                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │    MongoDB     │
                    │   Database     │
                    └────────────────┘
```

## Component Details

### 1. Widget (Embedded on Customer Website)

```
┌─────────────────────────────────┐
│    Chat Widget (React)          │
├─────────────────────────────────┤
│  • Floating Button              │
│  • Pre-chat Form                │
│  • Message Window               │
│  • Typing Indicator             │
│  • Rating System                │
│  • Socket.io Client             │
└─────────────────────────────────┘
```

**Technologies:**
- React 18
- Socket.io-client
- Webpack (bundled)
- CSS (embedded)

**Integration:**
```html
<script src="widget.js"></script>
<script>
  LiveChatWidget.init({ apiUrl: 'https://api.example.com' });
</script>
```

### 2. Dashboard (Agent Interface)

```
┌──────────────────────────────────────────────────┐
│         Dashboard (React + Tailwind)             │
├──────────────────────────────────────────────────┤
│  ┌──────────┐  ┌───────────────────────────┐    │
│  │ Sidebar  │  │        Header             │    │
│  │          │  └───────────────────────────┘    │
│  │ • Convs  │  ┌───────────────────────────┐    │
│  │ • Analyt │  │   Main Content Area       │    │
│  │ • Visitor│  │                           │    │
│  │ • Setting│  │  • Conversation List      │    │
│  │          │  │  • Chat Window            │    │
│  └──────────┘  │  • Visitor Info Panel     │    │
│                │  • Analytics Charts       │    │
│                │  • Settings               │    │
│                └───────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

**Pages:**
- Login / Register
- Dashboard (Conversations)
- Analytics
- Settings
- Visitors

**Technologies:**
- React 18
- React Router DOM 6
- Tailwind CSS 3
- Socket.io-client
- Axios
- Lucide Icons
- React Hot Toast

### 3. Backend API Server

```
┌────────────────────────────────────────────────┐
│           Express.js Application               │
├────────────────────────────────────────────────┤
│  Middleware Layer                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  CORS    │ │  Helmet  │ │  Morgan  │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────────────────┐        │
│  │   Auth   │ │  Express Validator   │        │
│  └──────────┘ └──────────────────────┘        │
├────────────────────────────────────────────────┤
│  Route Handlers                                │
│  • Authentication (register, login, logout)    │
│  • Conversations (CRUD, assign, transfer)      │
│  • Messages (send, read, list)                 │
│  • Visitors (track, update, list)              │
│  • Analytics (stats, charts, performance)      │
│  • Canned Responses (CRUD)                     │
├────────────────────────────────────────────────┤
│  Socket.io Real-time Layer                     │
│  • Agent connections                           │
│  • Visitor connections                         │
│  • Message broadcasting                        │
│  • Typing indicators                           │
│  • Status updates                              │
├────────────────────────────────────────────────┤
│  Data Access Layer (Mongoose)                  │
│  • User Model                                  │
│  • Visitor Model                               │
│  • Conversation Model                          │
│  • Message Model                               │
│  • CannedResponse Model                        │
└────────────────────────────────────────────────┘
```

**Technologies:**
- Node.js 18
- Express.js 4
- Socket.io 4
- Mongoose (MongoDB ODM)
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### 4. Database Schema

```
MongoDB Collections:

┌─────────────┐
│   users     │
├─────────────┤
│ _id         │
│ name        │
│ email       │
│ password    │ (hashed)
│ role        │
│ status      │
│ createdAt   │
└─────────────┘

┌─────────────┐
│  visitors   │
├─────────────┤
│ _id         │
│ sessionId   │
│ name        │
│ email       │
│ ipAddress   │
│ browser     │
│ os          │
│ isOnline    │
│ lastSeen    │
└─────────────┘

┌─────────────────┐
│ conversations   │
├─────────────────┤
│ _id             │
│ visitor         │ → visitors._id
│ assignedAgent   │ → users._id
│ status          │
│ tags[]          │
│ notes           │
│ rating          │
│ lastMessageAt   │
│ createdAt       │
└─────────────────┘

┌─────────────┐
│  messages   │
├─────────────┤
│ _id         │
│ conversation│ → conversations._id
│ sender      │ (agent/visitor)
│ senderId    │
│ content     │
│ type        │
│ isRead      │
│ createdAt   │
└─────────────┘

┌─────────────────────┐
│ cannedresponses     │
├─────────────────────┤
│ _id                 │
│ title               │
│ content             │
│ shortcut            │
│ category            │
│ createdBy           │ → users._id
│ createdAt           │
└─────────────────────┘
```

## Data Flow

### 1. Visitor Starts Chat

```
Widget                Backend              Database          Dashboard
  |                      |                     |                |
  |--Socket Connect----->|                     |                |
  |                      |---Create Visitor--->|                |
  |<--Visitor Created----|                     |                |
  |                      |                     |                |
  |--Start Conv--------->|                     |                |
  |                      |---Create Conv------>|                |
  |                      |---Create Message--->|                |
  |<--Conv Created-------|                     |                |
  |                      |--------Notify New Conv------------->|
  |                      |                     |                |
```

### 2. Agent Responds

```
Dashboard            Backend              Database           Widget
  |                      |                     |                |
  |--Send Message------->|                     |                |
  |                      |---Save Message----->|                |
  |                      |<--------------------|                |
  |<--Message Saved------|                     |                |
  |                      |--------Broadcast Message------------>|
  |                      |                     |                |
```

### 3. Real-time Updates

```
Any Client           Backend              Other Clients
  |                      |                     |
  |--Typing Start------->|                     |
  |                      |--Broadcast--------->|
  |                      |                     |
  |--Message Send------->|                     |
  |                      |--Broadcast--------->|
  |                      |                     |
  |--Status Change------>|                     |
  |                      |--Broadcast--------->|
```

## Security Architecture

```
┌────────────────────────────────────────────────┐
│            Security Layers                     │
├────────────────────────────────────────────────┤
│  1. HTTPS (TLS/SSL)                           │
│     • Encrypted communication                  │
│     • Certificate validation                   │
├────────────────────────────────────────────────┤
│  2. Authentication (JWT)                       │
│     • Token-based auth                         │
│     • Expiration handling                      │
│     • Secure token storage                     │
├────────────────────────────────────────────────┤
│  3. Authorization                              │
│     • Role-based access control                │
│     • Route protection                         │
│     • Resource ownership                       │
├────────────────────────────────────────────────┤
│  4. Password Security                          │
│     • bcrypt hashing (10 rounds)               │
│     • Salt generation                          │
│     • Never stored in plain text              │
├────────────────────────────────────────────────┤
│  5. Input Validation                           │
│     • express-validator                        │
│     • Type checking                            │
│     • Sanitization                             │
├────────────────────────────────────────────────┤
│  6. CORS                                       │
│     • Whitelist origins                        │
│     • Credentials handling                     │
├────────────────────────────────────────────────┤
│  7. Security Headers (Helmet)                  │
│     • XSS protection                           │
│     • Content Security Policy                  │
│     • Frame options                            │
└────────────────────────────────────────────────┘
```

## Deployment Architecture

### Docker Compose Setup

```
┌──────────────────────────────────────────────────┐
│             Docker Compose Stack                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────┐                             │
│  │   MongoDB      │  Port: 27017                │
│  │   Container    │  Volume: mongodb_data       │
│  └────────┬───────┘                             │
│           │                                      │
│  ┌────────┴───────┐                             │
│  │   Backend      │  Port: 5000                 │
│  │   Container    │  Env: production            │
│  └────────┬───────┘                             │
│           │                                      │
│  ┌────────┴───────┐                             │
│  │   Dashboard    │  Port: 3000                 │
│  │   Container    │  Serves: build/             │
│  └────────────────┘                             │
│                                                  │
│  Network: livechat-network (bridge)             │
└──────────────────────────────────────────────────┘
```

### Cloud Deployment Options

```
1. AWS / GCP / Azure
   ┌──────────────┐
   │ Load Balancer│
   └──────┬───────┘
          │
   ┌──────┴───────────┬──────────────┐
   │                  │              │
   ▼                  ▼              ▼
┌──────┐          ┌──────┐      ┌──────┐
│ App  │          │ App  │      │ App  │
│Server│          │Server│      │Server│
└──┬───┘          └──┬───┘      └──┬───┘
   │                 │             │
   └─────────┬───────┴─────────────┘
             ▼
     ┌───────────────┐
     │ MongoDB Atlas │
     └───────────────┘

2. Heroku
   • Backend: Node.js dyno
   • Dashboard: Static site or dyno
   • MongoDB: MongoDB Atlas

3. Vercel / Netlify
   • Dashboard: Static deployment
   • Backend: Serverless functions
   • MongoDB: MongoDB Atlas
```

## Performance Considerations

- **Horizontal Scaling**: Multiple backend instances with load balancer
- **Database Indexing**: Indexes on frequently queried fields
- **Caching**: Redis for session management (future enhancement)
- **CDN**: Static assets served via CDN
- **WebSocket**: Persistent connections for real-time updates
- **Compression**: gzip compression for responses

## Monitoring & Logging

```
┌─────────────────────────────────────┐
│    Application Monitoring           │
├─────────────────────────────────────┤
│  • Morgan HTTP request logging      │
│  • Console.log for development      │
│  • Socket.io connection tracking    │
│  • Error logging middleware         │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│   Future: Production Monitoring     │
├─────────────────────────────────────┤
│  • PM2 for process management       │
│  • Winston for structured logging   │
│  • Sentry for error tracking        │
│  • Prometheus for metrics           │
│  • Grafana for visualization        │
└─────────────────────────────────────┘
```

---

## Summary

This architecture provides:

✅ **Scalability**: Horizontally scalable backend  
✅ **Real-time**: WebSocket for instant updates  
✅ **Security**: Multiple layers of protection  
✅ **Maintainability**: Clean separation of concerns  
✅ **Flexibility**: Easy to extend and modify  
✅ **Performance**: Efficient database queries and caching ready  
✅ **Deployment**: Docker and cloud-ready
