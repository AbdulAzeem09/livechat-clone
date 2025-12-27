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
  currentPage: {
    type: String,
    default: '',
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
