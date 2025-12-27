const mongoose = require('mongoose');

const cannedResponseSchema = new mongoose.Schema({
  shortcut: {
    type: String,
    required: [true, 'Shortcut is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Shortcut cannot exceed 50 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    default: 'General',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster searches
cannedResponseSchema.index({ shortcut: 1 });
cannedResponseSchema.index({ category: 1 });
cannedResponseSchema.index({ createdBy: 1 });

// Increment usage count
cannedResponseSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  await this.save();
};

module.exports = mongoose.model('CannedResponse', cannedResponseSchema);
