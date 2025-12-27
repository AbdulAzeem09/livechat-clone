const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  },
  events: [{
    type: String,
    enum: [
      'conversation.started',
      'conversation.assigned',
      'conversation.closed',
      'message.sent',
      'message.received',
      'visitor.joined',
      'agent.status.changed',
      'rating.submitted',
    ],
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  secret: {
    type: String,
  },
  headers: {
    type: Map,
    of: String,
  },
  retryPolicy: {
    maxRetries: {
      type: Number,
      default: 3,
    },
    retryDelay: {
      type: Number,
      default: 1000, // milliseconds
    },
  },
  lastTriggered: {
    type: Date,
  },
  successCount: {
    type: Number,
    default: 0,
  },
  failureCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Webhook', webhookSchema);
