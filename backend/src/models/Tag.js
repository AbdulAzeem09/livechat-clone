const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Tag name cannot exceed 50 characters'],
  },
  color: {
    type: String,
    default: '#3b82f6',
    match: [/^#[0-9A-F]{6}$/i, 'Invalid color format'],
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['conversation', 'visitor', 'general'],
    default: 'general',
  },
  usageCount: {
    type: Number,
    default: 0,
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
tagSchema.index({ name: 1 });
tagSchema.index({ category: 1 });

// Increment usage count
tagSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  await this.save();
};

module.exports = mongoose.model('Tag', tagSchema);
