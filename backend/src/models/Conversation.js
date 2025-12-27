const mongoose = require('mongoose');
const { CONVERSATION_STATUS, PRIORITY } = require('../config/constants');

const conversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  },
  status: {
    type: String,
    enum: Object.values(CONVERSATION_STATUS),
    default: CONVERSATION_STATUS.PENDING,
    index: true,
  },
  priority: {
    type: String,
    enum: Object.values(PRIORITY),
    default: PRIORITY.MEDIUM,
  },
  subject: {
    type: String,
    default: '',
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  unreadCount: {
    visitor: {
      type: Number,
      default: 0,
    },
    agent: {
      type: Number,
      default: 0,
    },
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  firstResponseAt: {
    type: Date,
    default: null,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  closedAt: {
    type: Date,
    default: null,
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    ratedAt: {
      type: Date,
      default: null,
    },
  },
  notes: [{
    content: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isInternal: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  transferHistory: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reason: {
      type: String,
      default: '',
    },
    transferredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  metadata: {
    channel: {
      type: String,
      enum: ['widget', 'whatsapp', 'facebook', 'telegram', 'email'],
      default: 'widget',
    },
    source: {
      type: String,
      default: '',
    },
    campaign: {
      type: String,
      default: '',
    },
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
conversationSchema.index({ assignedTo: 1, status: 1 });
conversationSchema.index({ department: 1, status: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ createdAt: -1 });

// Calculate first response time
conversationSchema.methods.calculateFirstResponseTime = function() {
  if (this.firstResponseAt) {
    const diff = this.firstResponseAt - this.createdAt;
    return Math.floor(diff / 1000 / 60); // in minutes
  }
  return null;
};

// Calculate resolution time
conversationSchema.methods.calculateResolutionTime = function() {
  if (this.resolvedAt) {
    const diff = this.resolvedAt - this.createdAt;
    return Math.floor(diff / 1000 / 60); // in minutes
  }
  return null;
};

// Get active conversations by agent
conversationSchema.statics.getActiveByAgent = async function(agentId) {
  return await this.find({
    assignedTo: agentId,
    status: { $in: [CONVERSATION_STATUS.PENDING, CONVERSATION_STATUS.ACTIVE] },
  });
};

// Get conversation statistics
conversationSchema.statics.getStatistics = async function(startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating.score' },
      },
    },
  ]);
};

module.exports = mongoose.model('Conversation', conversationSchema);
