const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  widgetId: {
    type: String,
    required: true,
    unique: true,
  },
  domain: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  appearance: {
    primaryColor: {
      type: String,
      default: '#FF5100',
    },
    buttonPosition: {
      type: String,
      enum: ['bottom-right', 'bottom-left'],
      default: 'bottom-right',
    },
    buttonText: {
      type: String,
      default: 'Chat with us',
    },
    welcomeMessage: {
      type: String,
      default: 'Hi! How can we help you today?',
    },
    offlineMessage: {
      type: String,
      default: 'We are currently offline. Leave us a message!',
    },
  },
  preChatForm: {
    enabled: {
      type: Boolean,
      default: true,
    },
    fields: [{
      name: String,
      label: String,
      type: String, // text, email, select, textarea
      required: Boolean,
      options: [String],
    }],
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  businessHours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessHours',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Widget', widgetSchema);
