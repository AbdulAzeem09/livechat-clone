const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Visitor = require('../models/Visitor');
const { SOCKET_EVENTS } = require('../config/constants');
const logger = require('../utils/logger');
const chatHandler = require('./chatHandler');
const agentHandler = require('./agentHandler');
const visitorHandler = require('./visitorHandler');

let io;

/**
 * Initialize Socket.io server
 */
const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const visitorId = socket.handshake.auth.visitorId;

      if (token) {
        // Authenticate agent/user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user || !user.isActive) {
          return next(new Error('Authentication failed'));
        }

        socket.user = user;
        socket.userType = 'agent';
      } else if (visitorId) {
        // Authenticate visitor
        let visitor = await Visitor.findOne({ visitorId });
        if (!visitor) {
          // Create new visitor if doesn't exist
          visitor = await Visitor.create({
            visitorId,
            ipAddress: socket.handshake.address,
            isOnline: true,
          });
        }

        socket.visitor = visitor;
        socket.userType = 'visitor';
      } else {
        return next(new Error('Authentication required'));
      }

      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    logger.info(`Socket connected: ${socket.id} (${socket.userType})`);

    if (socket.userType === 'agent') {
      handleAgentConnection(socket);
    } else if (socket.userType === 'visitor') {
      handleVisitorConnection(socket);
    }

    // Register handlers
    chatHandler(socket, io);
    agentHandler(socket, io);
    visitorHandler(socket, io);

    // Disconnect handler
    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      
      try {
        if (socket.userType === 'agent' && socket.user) {
          // Update agent status
          socket.user.socketId = null;
          socket.user.lastActive = new Date();
          await socket.user.save();

          // Notify others
          io.emit(SOCKET_EVENTS.AGENT_OFFLINE, {
            agentId: socket.user._id,
          });
        } else if (socket.userType === 'visitor' && socket.visitor) {
          // Update visitor status
          socket.visitor.isOnline = false;
          socket.visitor.socketId = null;
          await socket.visitor.save();

          // Notify agents
          io.emit(SOCKET_EVENTS.VISITOR_LEFT, {
            visitorId: socket.visitor.visitorId,
          });
        }
      } catch (error) {
        logger.error('Disconnect handler error:', error);
      }
    });
  });

  logger.info('Socket.io server initialized');
  return io;
};

/**
 * Handle agent connection
 */
const handleAgentConnection = async (socket) => {
  try {
    // Update agent socket ID and status
    socket.user.socketId = socket.id;
    socket.user.status = 'online';
    socket.user.lastActive = new Date();
    await socket.user.save();

    // Join agent room
    socket.join(`agent:${socket.user._id}`);

    // Notify other agents
    io.emit(SOCKET_EVENTS.AGENT_ONLINE, {
      agentId: socket.user._id,
      name: socket.user.name,
      avatar: socket.user.avatar,
    });

    logger.info(`Agent connected: ${socket.user.name} (${socket.user._id})`);
  } catch (error) {
    logger.error('Agent connection error:', error);
  }
};

/**
 * Handle visitor connection
 */
const handleVisitorConnection = async (socket) => {
  try {
    // Update visitor socket ID and status
    socket.visitor.socketId = socket.id;
    socket.visitor.isOnline = true;
    await socket.visitor.updateLastSeen();

    // Join visitor room
    socket.join(`visitor:${socket.visitor.visitorId}`);

    // Notify agents
    io.emit(SOCKET_EVENTS.VISITOR_JOINED, {
      visitorId: socket.visitor.visitorId,
      name: socket.visitor.name || 'Anonymous',
      location: socket.visitor.location,
    });

    logger.info(`Visitor connected: ${socket.visitor.visitorId}`);
  } catch (error) {
    logger.error('Visitor connection error:', error);
  }
};

/**
 * Get Socket.io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Emit to specific user/agent
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`agent:${userId}`).emit(event, data);
  }
};

/**
 * Emit to specific visitor
 */
const emitToVisitor = (visitorId, event, data) => {
  if (io) {
    io.to(`visitor:${visitorId}`).emit(event, data);
  }
};

/**
 * Emit to all agents
 */
const emitToAllAgents = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToVisitor,
  emitToAllAgents,
};
