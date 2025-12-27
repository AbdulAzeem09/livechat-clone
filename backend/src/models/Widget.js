const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Widget name is required'],
    trim: true,
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  appearance: {
    primaryColor: {
      type: String,
      default: '#3b82f6',
      match: [/^#[0-9A-F]{6}$/i, 'Invalid color format'],
    },
    position: {
      type: String,
      enum: ['left', 'right'],
      default: 'right',
    },
    launcherIcon: {
      type: String,
      default: 'chat',
    },
    agentAvatar: {
      type: String,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    welcomeMessage: {
      type: String,
      default: 'Hi! How can we help you today?',
    },
    offlineMessage: {
      type: String,
      default: 'Sorry, we are currently offline. Please leave us a message.',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light',
    },
  },
  preChatForm: {
    enabled: {
      type: Boolean,
      default: false,
    },
    fields: [{
      name: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['text', 'email', 'phone', 'textarea', 'select'],
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      options: [String], // For select fields
    }],
  },
  offlineForm: {
    enabled: {
      type: Boolean,
      default: true,
    },
    fields: [{
      name: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['text', 'email', 'phone', 'textarea'],
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
    }],
  },
  ratingForm: {
    enabled: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: 'How was your experience?',
    },
    feedbackEnabled: {
      type: Boolean,
      default: true,
    },
  },
  notifications: {
    sound: {
      type: Boolean,
      default: true,
    },
    desktop: {
      type: Boolean,
      default: true,
    },
  },
  language: {
    type: String,
    default: 'en',
  },
  businessHours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessHours',
    default: null,
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
widgetSchema.index({ domain: 1 });
widgetSchema.index({ isActive: 1 });

module.exports = mongoose.model('Widget', widgetSchema);
