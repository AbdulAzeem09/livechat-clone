const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: String,
    enum: ['agent', 'visitor'],
    required: true,
  },
  senderModel: {
    type: String,
    enum: ['User', 'Visitor'],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text',
  },
  fileUrl: {
    type: String,
    default: '',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  // Message reactions
  reactions: [{
    emoji: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'reactions.userModel',
    },
    userModel: {
      type: String,
      enum: ['User', 'Visitor'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Edit history
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Deletion
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
