const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
    lowercase: true,
  },
  phone: {
    type: String,
    default: '',
  },
  ipAddress: {
    type: String,
    required: true,
  },
  location: {
    country: {
      type: String,
      default: 'Unknown',
    },
    city: {
      type: String,
      default: 'Unknown',
    },
    region: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    coordinates: {
      type: [Number], // [lat, lng]
      default: [0, 0],
    },
  },
  browser: {
    name: {
      type: String,
      default: '',
    },
    version: {
      type: String,
      default: '',
    },
  },
  os: {
    name: {
      type: String,
      default: '',
    },
    version: {
      type: String,
      default: '',
    },
  },
  device: {
    type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown',
    },
    screenResolution: {
      type: String,
      default: '',
    },
  },
  language: {
    type: String,
    default: 'en',
  },
  referrer: {
    type: String,
    default: '',
  },
  landingPage: {
    type: String,
    default: '',
  },
  currentPage: {
    url: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  pageViews: [{
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
  }],
  visitCount: {
    type: Number,
    default: 1,
  },
  totalTimeOnSite: {
    type: Number, // in seconds
    default: 0,
  },
  customAttributes: {
    type: Map,
    of: String,
    default: new Map(),
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  notes: [{
    content: {
      type: String,
      required: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  isBanned: {
    type: Boolean,
    default: false,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  socketId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for faster queries
visitorSchema.index({ email: 1 });
visitorSchema.index({ isOnline: 1 });
visitorSchema.index({ lastSeen: -1 });

// Update last seen
visitorSchema.methods.updateLastSeen = async function() {
  this.lastSeen = new Date();
  this.isOnline = true;
  await this.save();
};

// Add page view
visitorSchema.methods.addPageView = async function(url, title) {
  this.pageViews.push({
    url,
    title,
    timestamp: new Date(),
  });
  
  this.currentPage = { url, title };
  await this.save();
};

module.exports = mongoose.model('Visitor', visitorSchema);
