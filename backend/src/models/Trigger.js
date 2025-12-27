const mongoose = require('mongoose');

const triggerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trigger name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  conditions: [{
    type: {
      type: String,
      enum: ['time_on_page', 'page_url', 'visitor_location', 'visit_count', 'custom_variable', 'exit_intent'],
      required: true,
    },
    operator: {
      type: String,
      enum: ['equals', 'contains', 'greater_than', 'less_than', 'starts_with', 'ends_with'],
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  }],
  actions: [{
    type: {
      type: String,
      enum: ['send_message', 'open_chat', 'show_notification', 'assign_to_agent', 'add_tag'],
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  }],
  priority: {
    type: Number,
    default: 0, // Higher number = higher priority
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  },
  executionCount: {
    type: Number,
    default: 0,
  },
  lastExecutedAt: {
    type: Date,
    default: null,
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
triggerSchema.index({ isActive: 1, priority: -1 });

// Increment execution count
triggerSchema.methods.incrementExecution = async function() {
  this.executionCount += 1;
  this.lastExecutedAt = new Date();
  await this.save();
};

// Check if conditions are met
triggerSchema.methods.checkConditions = function(visitorData) {
  return this.conditions.every(condition => {
    const visitorValue = visitorData[condition.type];
    
    switch (condition.operator) {
      case 'equals':
        return visitorValue === condition.value;
      case 'contains':
        return String(visitorValue).includes(condition.value);
      case 'greater_than':
        return Number(visitorValue) > Number(condition.value);
      case 'less_than':
        return Number(visitorValue) < Number(condition.value);
      case 'starts_with':
        return String(visitorValue).startsWith(condition.value);
      case 'ends_with':
        return String(visitorValue).endsWith(condition.value);
      default:
        return false;
    }
  });
};

module.exports = mongoose.model('Trigger', triggerSchema);
