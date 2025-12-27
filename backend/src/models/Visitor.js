const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Anonymous',
  },
  email: {
    type: String,
    default: '',
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  browser: {
    type: String,
    default: '',
  },
  os: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  // Geolocation tracking
  geolocation: {
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    accuracy: {
      type: Number,
      default: null,
    },
    timestamp: {
      type: Date,
      default: null,
    },
  },
  // Page tracking
  currentPage: {
    type: String,
    default: '',
  },
  pageViews: [{
    url: String,
    title: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: Number, // seconds spent on page
  }],
  visitCount: {
    type: Number,
    default: 1,
  },
  totalTimeOnSite: {
    type: Number,
    default: 0, // in seconds
  },
  referrer: {
    type: String,
    default: '',
  },
  isOnline: {
    type: Boolean,
    default: true,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Visitor', visitorSchema);
