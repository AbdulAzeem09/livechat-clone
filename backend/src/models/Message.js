const mongoose = require('mongoose');
const { MESSAGE_STATUS, MESSAGE_TYPE } = require('../config/constants');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true,
  },
  sender: {
    type: {
      type: String,
      enum: ['agent', 'visitor', 'system'],
      required: true,
    },
    id: {
      type: mongoose.Schema.Types.Mixed, // Can be User ObjectId or Visitor ObjectId
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  type: {
    type: String,
    enum: Object.values(MESSAGE_TYPE),
    default: MESSAGE_TYPE.TEXT,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(MESSAGE_STATUS),
    default: MESSAGE_STATUS.SENT,
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file'],
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: '',
    },
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  reactions: [{
    emoji: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isEdited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deliveredAt: {
    type: Date,
    default: null,
  },
  readAt: {
    type: Date,
    default: null,
  },
  metadata: {
    userAgent: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true,
});

// Indexes for better performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ 'sender.id': 1 });
messageSchema.index({ status: 1 });

// Mark message as delivered
messageSchema.methods.markAsDelivered = async function() {
  this.status = MESSAGE_STATUS.DELIVERED;
  this.deliveredAt = new Date();
  await this.save();
};

// Mark message as read
messageSchema.methods.markAsRead = async function() {
  this.status = MESSAGE_STATUS.READ;
  this.readAt = new Date();
  await this.save();
};

// Soft delete message
messageSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
};

// Add reaction
messageSchema.methods.addReaction = async function(emoji, userId) {
  // Remove existing reaction from user if any
  this.reactions = this.reactions.filter(r => r.userId.toString() !== userId.toString());
  
  // Add new reaction
  this.reactions.push({
    emoji,
    userId,
    createdAt: new Date(),
  });
  
  await this.save();
};

// Get unread messages count
messageSchema.statics.getUnreadCount = async function(conversationId, senderType) {
  return await this.countDocuments({
    conversation: conversationId,
    'sender.type': senderType,
    status: { $ne: MESSAGE_STATUS.READ },
    isDeleted: false,
  });
};

module.exports = mongoose.model('Message', messageSchema);
