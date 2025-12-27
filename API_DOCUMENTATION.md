# LiveChat Clone - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register a New User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "agent"  // Optional: agent, admin, super_admin
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "agent" },
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

---

## Conversations

### Get All Conversations
```http
GET /conversations?page=1&limit=30&status=active&department=dept_id
Authorization: Bearer <token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 30, max: 100)
- `status`: Filter by status (pending, active, resolved, closed, missed)
- `assignedTo`: Filter by assigned agent
- `department`: Filter by department

### Get Conversation by ID
```http
GET /conversations/:id
Authorization: Bearer <token>
```

### Assign Conversation
```http
POST /conversations/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "agentId": "agent_id_here"
}
```

### Transfer Conversation
```http
POST /conversations/:id/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "toAgentId": "target_agent_id",
  "reason": "Reason for transfer"
}
```

### Update Conversation Status
```http
PUT /conversations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved"  // pending, active, resolved, closed
}
```

### Rate Conversation
```http
POST /conversations/:id/rating
Content-Type: application/json

{
  "score": 5,  // 1-5
  "feedback": "Great service!"
}
```

### Add Note to Conversation
```http
POST /conversations/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Customer requested callback",
  "isInternal": true
}
```

---

## Messages

### Get Messages for Conversation
```http
GET /messages/:conversationId?page=1&limit=50
Authorization: Bearer <token>
```

### Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "conv_id",
  "content": "Hello, how can I help you?",
  "type": "text",  // text, image, file, system
  "replyTo": "message_id"  // Optional: ID of message being replied to
}
```

### Edit Message
```http
PUT /messages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated message content"
}
```

### Delete Message
```http
DELETE /messages/:id
Authorization: Bearer <token>
```

### Add Reaction to Message
```http
POST /messages/:id/reaction
Authorization: Bearer <token>
Content-Type: application/json

{
  "emoji": "👍"
}
```

### Mark Messages as Read
```http
POST /messages/read/:conversationId
Authorization: Bearer <token>
```

---

## Visitors

### Get All Visitors
```http
GET /visitors?page=1&limit=30&search=keyword
Authorization: Bearer <token>
```

### Get Visitor by ID
```http
GET /visitors/:id
Authorization: Bearer <token>
```

### Track Visitor (Public Endpoint for Widget)
```http
POST /visitors/track
Content-Type: application/json

{
  "visitorId": "visitor_unique_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "pageUrl": "https://example.com/page",
  "pageTitle": "Page Title",
  "userAgent": "Mozilla/5.0...",
  "customAttributes": {
    "plan": "premium",
    "company": "ACME Inc"
  }
}
```

### Add Note to Visitor
```http
POST /visitors/:id/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Important customer, VIP treatment"
}
```

### Ban/Unban Visitor
```http
PUT /visitors/:id/ban
Authorization: Bearer <token>
Content-Type: application/json

{
  "isBanned": true
}
```

---

## Analytics

### Dashboard Statistics
```http
GET /analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activeConversations": 15,
    "totalConversations": 1250,
    "agentsOnline": 8,
    "avgRating": 4.7,
    "totalRatings": 890,
    "avgResponseTime": 3.5
  }
}
```

### Conversations by Status
```http
GET /analytics/conversations?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Conversations Over Time
```http
GET /analytics/conversations-over-time?startDate=2024-01-01&endDate=2024-12-31&interval=day
Authorization: Bearer <token>
```

### Agent Performance
```http
GET /analytics/agent-performance?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Rating Distribution
```http
GET /analytics/rating-distribution?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### Export to CSV
```http
GET /analytics/export-csv?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

---

## Canned Responses

### Get All Canned Responses
```http
GET /canned-responses
Authorization: Bearer <token>
```

### Create Canned Response
```http
POST /canned-responses
Authorization: Bearer <token>
Content-Type: application/json

{
  "shortcut": "/hello",
  "message": "Hello! How can I help you today?",
  "category": "Greeting"
}
```

### Update Canned Response
```http
PUT /canned-responses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Updated message"
}
```

### Delete Canned Response
```http
DELETE /canned-responses/:id
Authorization: Bearer <token>
```

---

## Departments

### Get All Departments
```http
GET /departments
Authorization: Bearer <token>
```

### Create Department
```http
POST /departments
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "name": "Sales",
  "description": "Sales department",
  "agents": ["agent_id_1", "agent_id_2"],
  "email": "sales@company.com"
}
```

### Update Department
```http
PUT /departments/:id
Authorization: Bearer <token> (Admin only)
Content-Type: application/json
```

### Delete Department
```http
DELETE /departments/:id
Authorization: Bearer <token> (Super Admin only)
```

---

## Triggers

### Get All Triggers
```http
GET /triggers
Authorization: Bearer <token>
```

### Create Trigger
```http
POST /triggers
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "name": "Welcome Message",
  "isActive": true,
  "conditions": [
    {
      "type": "time_on_page",
      "operator": "greater_than",
      "value": 30
    }
  ],
  "actions": [
    {
      "type": "send_message",
      "value": "Hello! Need any help?"
    }
  ],
  "priority": 1
}
```

---

## Widgets

### Get All Widgets
```http
GET /widgets
Authorization: Bearer <token>
```

### Get Widget by ID (Public)
```http
GET /widgets/:id
```

### Create Widget
```http
POST /widgets
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "name": "Main Website Widget",
  "domain": "example.com",
  "appearance": {
    "primaryColor": "#3b82f6",
    "position": "right",
    "welcomeMessage": "Hi! How can we help?"
  }
}
```

---

## Webhooks

### Get All Webhooks
```http
GET /webhooks
Authorization: Bearer <token>
```

### Create Webhook
```http
POST /webhooks
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "name": "Slack Notifications",
  "url": "https://hooks.slack.com/services/...",
  "events": ["conversation.new", "message.new"],
  "isActive": true,
  "secret": "webhook-secret"
}
```

### Test Webhook
```http
POST /webhooks/:id/test
Authorization: Bearer <token> (Admin only)
```

---

## Tags

### Get All Tags
```http
GET /tags
Authorization: Bearer <token>
```

### Create Tag
```http
POST /tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Important",
  "color": "#ef4444",
  "category": "conversation"
}
```

---

## Admin

### Get All Users
```http
GET /admin/users?page=1&limit=30
Authorization: Bearer <token> (Admin only)
```

### Update User
```http
PUT /admin/users/:id
Authorization: Bearer <token> (Admin only)
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin",
  "isActive": true
}
```

### Delete User
```http
DELETE /admin/users/:id
Authorization: Bearer <token> (Super Admin only)
```

### Get Audit Logs
```http
GET /admin/audit-logs?page=1&limit=50
Authorization: Bearer <token> (Admin only)
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [  // Optional: validation errors
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error
