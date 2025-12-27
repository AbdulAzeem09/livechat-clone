const Visitor = require('../models/Visitor');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

/**
 * Initialize Socket.io chat functionality
 */
module.exports = (io) => {
  const onlineAgents = new Map();
  const onlineVisitors = new Map();

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    /**
     * Agent connects and joins online agents
     */
    socket.on('agent:connect', async (data) => {
      try {
        const { userId } = data;
        onlineAgents.set(userId, socket.id);
        socket.userId = userId;
        socket.userType = 'agent';

        await User.findByIdAndUpdate(userId, { status: 'online' });

        socket.join('agents');
        io.to('agents').emit('agent:online', { userId });
        
        console.log(`Agent ${userId} connected`);
      } catch (error) {
        console.error('Agent connect error:', error);
      }
    });

    /**
     * Visitor connects and initializes session
     */
    socket.on('visitor:connect', async (data) => {
      try {
        const { sessionId, name, email, userAgent, ipAddress } = data;
        
        let visitor = await Visitor.findOne({ sessionId });
        
        if (!visitor) {
          visitor = await Visitor.create({
            sessionId,
            name: name || 'Anonymous',
            email: email || '',
            userAgent: userAgent || '',
            ipAddress: ipAddress || '',
            isOnline: true,
          });
        } else {
          visitor.isOnline = true;
          visitor.lastSeen = new Date();
          await visitor.save();
        }

        onlineVisitors.set(sessionId, socket.id);
        socket.sessionId = sessionId;
        socket.visitorId = visitor._id.toString();
        socket.userType = 'visitor';

        socket.emit('visitor:connected', { visitorId: visitor._id });
        io.to('agents').emit('visitor:online', { visitor });
        
        console.log(`Visitor ${sessionId} connected`);
      } catch (error) {
        console.error('Visitor connect error:', error);
        socket.emit('error', { message: 'Connection failed' });
      }
    });

    /**
     * Visitor starts a new conversation
     */
    socket.on('conversation:start', async (data) => {
      try {
        const { visitorId, message } = data;
        
        const visitor = await Visitor.findById(visitorId);
        if (!visitor) {
          return socket.emit('error', { message: 'Visitor not found' });
        }

        const conversation = await Conversation.create({
          visitor: visitorId,
          status: 'pending',
        });

        if (message) {
          const newMessage = await Message.create({
            conversation: conversation._id,
            sender: 'visitor',
            senderModel: 'Visitor',
            senderId: visitorId,
            content: message,
            type: 'text',
          });

          await conversation.updateOne({ lastMessageAt: new Date() });
        }

        const populatedConversation = await Conversation.findById(conversation._id)
          .populate('visitor');

        socket.join(`conversation:${conversation._id}`);
        socket.emit('conversation:created', { conversation: populatedConversation });
        io.to('agents').emit('conversation:new', { conversation: populatedConversation });
        
        console.log(`Conversation ${conversation._id} started`);
      } catch (error) {
        console.error('Conversation start error:', error);
        socket.emit('error', { message: 'Failed to start conversation' });
      }
    });

    /**
     * Join a conversation room
     */
    socket.on('conversation:join', async (data) => {
      try {
        const { conversationId } = data;
        socket.join(`conversation:${conversationId}`);
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
      } catch (error) {
        console.error('Conversation join error:', error);
      }
    });

    /**
     * Send a message
     */
    socket.on('message:send', async (data) => {
      try {
        const { conversationId, content, sender, senderId, senderModel } = data;

        if (!content || !conversationId) {
          return socket.emit('error', { message: 'Invalid message data' });
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: sender || (socket.userType === 'agent' ? 'agent' : 'visitor'),
          senderModel: senderModel || (socket.userType === 'agent' ? 'User' : 'Visitor'),
          senderId: senderId || (socket.userType === 'agent' ? socket.userId : socket.visitorId),
          content,
          type: 'text',
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessageAt: new Date(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('senderId', 'name email');

        io.to(`conversation:${conversationId}`).emit('message:new', { message: populatedMessage });
        
        if (socket.userType === 'visitor') {
          io.to('agents').emit('message:new', { message: populatedMessage });
        }
        
        console.log(`Message sent in conversation ${conversationId}`);
      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Typing indicator
     */
    socket.on('typing:start', (data) => {
      const { conversationId, userName } = data;
      socket.to(`conversation:${conversationId}`).emit('typing:start', { conversationId, userName });
    });

    socket.on('typing:stop', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('typing:stop', { conversationId });
    });

    /**
     * Mark messages as read
     */
    socket.on('message:read', async (data) => {
      try {
        const { messageId } = data;
        
        await Message.findByIdAndUpdate(messageId, {
          isRead: true,
          readAt: new Date(),
        });

        io.to(`conversation:${data.conversationId}`).emit('message:read', { messageId });
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    /**
     * Disconnect handler
     */
    socket.on('disconnect', async () => {
      try {
        if (socket.userType === 'agent' && socket.userId) {
          onlineAgents.delete(socket.userId);
          await User.findByIdAndUpdate(socket.userId, { status: 'offline' });
          io.to('agents').emit('agent:offline', { userId: socket.userId });
          console.log(`Agent ${socket.userId} disconnected`);
        }

        if (socket.userType === 'visitor' && socket.sessionId) {
          onlineVisitors.delete(socket.sessionId);
          await Visitor.findOneAndUpdate(
            { sessionId: socket.sessionId },
            { isOnline: false, lastSeen: new Date() }
          );
          io.to('agents').emit('visitor:offline', { sessionId: socket.sessionId });
          console.log(`Visitor ${socket.sessionId} disconnected`);
        }
      } catch (error) {
        console.error('Disconnect error:', error);
      }

      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
