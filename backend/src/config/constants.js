module.exports = {
  // User Roles
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    AGENT: 'agent',
  },

  // Agent Status
  AGENT_STATUS: {
    ONLINE: 'online',
    OFFLINE: 'offline',
    AWAY: 'away',
    BUSY: 'busy',
  },

  // Conversation Status
  CONVERSATION_STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
    MISSED: 'missed',
  },

  // Conversation Priority
  PRIORITY: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
  },

  // Message Status
  MESSAGE_STATUS: {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
  },

  // Message Types
  MESSAGE_TYPE: {
    TEXT: 'text',
    IMAGE: 'image',
    FILE: 'file',
    SYSTEM: 'system',
  },

  // Socket Events
  SOCKET_EVENTS: {
    // Connection
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    
    // Agent
    AGENT_STATUS_CHANGE: 'agent:status:change',
    AGENT_ONLINE: 'agent:online',
    AGENT_OFFLINE: 'agent:offline',
    
    // Chat
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVE: 'message:receive',
    MESSAGE_DELIVERED: 'message:delivered',
    MESSAGE_READ: 'message:read',
    MESSAGE_EDIT: 'message:edit',
    MESSAGE_DELETE: 'message:delete',
    MESSAGE_REACTION: 'message:reaction',
    
    // Typing
    TYPING_START: 'typing:start',
    TYPING_STOP: 'typing:stop',
    
    // Conversation
    CONVERSATION_ASSIGNED: 'conversation:assigned',
    CONVERSATION_TRANSFERRED: 'conversation:transferred',
    CONVERSATION_RESOLVED: 'conversation:resolved',
    CONVERSATION_CLOSED: 'conversation:closed',
    
    // Visitor
    VISITOR_JOINED: 'visitor:joined',
    VISITOR_LEFT: 'visitor:left',
    VISITOR_PAGE_VIEW: 'visitor:page:view',
    
    // Notifications
    NOTIFICATION: 'notification',
    
    // Sneak Peek
    SNEAK_PEEK: 'sneak:peek',
  },

  // Webhook Events
  WEBHOOK_EVENTS: {
    NEW_CONVERSATION: 'conversation.new',
    NEW_MESSAGE: 'message.new',
    CONVERSATION_RESOLVED: 'conversation.resolved',
    CONVERSATION_CLOSED: 'conversation.closed',
    RATING_RECEIVED: 'rating.received',
    AGENT_STATUS_CHANGED: 'agent.status.changed',
  },

  // Trigger Conditions
  TRIGGER_CONDITIONS: {
    TIME_ON_PAGE: 'time_on_page',
    PAGE_URL: 'page_url',
    VISITOR_LOCATION: 'visitor_location',
    VISIT_COUNT: 'visit_count',
    CUSTOM_VARIABLE: 'custom_variable',
  },

  // Assignment Methods
  ASSIGNMENT_METHOD: {
    ROUND_ROBIN: 'round_robin',
    LOAD_BALANCING: 'load_balancing',
    BY_DEPARTMENT: 'by_department',
    BY_SKILL: 'by_skill',
  },

  // Widget Position
  WIDGET_POSITION: {
    LEFT: 'left',
    RIGHT: 'right',
  },

  // File Types
  ALLOWED_FILE_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  },

  // Pagination
  DEFAULT_PAGE_SIZE: 30,
  MAX_PAGE_SIZE: 100,

  // Session
  SESSION_EXPIRE_TIME: 3600, // 1 hour in seconds
  
  // Auto-close
  AUTO_CLOSE_INACTIVE_HOURS: 24,
};
