const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  color: {
    type: String,
    default: '#3B82F6', // Blue
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['priority', 'topic', 'status', 'custom'],
    default: 'custom',
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tag', tagSchema);
