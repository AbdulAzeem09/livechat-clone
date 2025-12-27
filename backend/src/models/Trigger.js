const mongoose = require('mongoose');

const triggerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  conditions: {
    type: {
      type: String,
      enum: ['all', 'any'],
      default: 'all',
    },
    rules: [{
      field: String, // e.g., 'pageUrl', 'timeOnSite', 'visitCount', 'country'
      operator: String, // e.g., 'equals', 'contains', 'greater_than', 'less_than'
      value: String,
    }],
  },
  actions: [{
    type: {
      type: String,
      enum: ['show_message', 'send_notification', 'assign_agent', 'add_tag', 'send_email'],
      required: true,
    },
    value: mongoose.Schema.Types.Mixed, // Flexible value for different action types
  }],
  priority: {
    type: Number,
    default: 0,
  },
  executionCount: {
    type: Number,
    default: 0,
  },
  lastExecuted: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Trigger', triggerSchema);
