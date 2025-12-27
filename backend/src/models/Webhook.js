const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Webhook name is required'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Webhook URL is required'],
    match: [/^https?:\/\/.+/, 'Invalid URL format'],
  },
  events: [{
    type: String,
    enum: [
      'conversation.new',
      'conversation.assigned',
      'conversation.resolved',
      'conversation.closed',
      'message.new',
      'rating.received',
      'agent.status.changed',
    ],
    required: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  secret: {
    type: String,
    default: '',
  },
  headers: {
    type: Map,
    of: String,
    default: new Map(),
  },
  retryPolicy: {
    maxRetries: {
      type: Number,
      default: 3,
    },
    retryDelay: {
      type: Number, // in seconds
      default: 60,
    },
  },
  lastTriggeredAt: {
    type: Date,
    default: null,
  },
  successCount: {
    type: Number,
    default: 0,
  },
  failureCount: {
    type: Number,
    default: 0,
  },
  lastError: {
    message: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: null,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
webhookSchema.index({ isActive: 1 });
webhookSchema.index({ events: 1 });

// Increment success count
webhookSchema.methods.recordSuccess = async function() {
  this.successCount += 1;
  this.lastTriggeredAt = new Date();
  await this.save();
};

// Increment failure count
webhookSchema.methods.recordFailure = async function(errorMessage) {
  this.failureCount += 1;
  this.lastError = {
    message: errorMessage,
    timestamp: new Date(),
  };
  this.lastTriggeredAt = new Date();
  await this.save();
};

module.exports = mongoose.model('Webhook', webhookSchema);
