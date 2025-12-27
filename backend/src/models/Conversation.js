const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true,
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'resolved', 'closed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  tags: [{
    type: String,
  }],
  notes: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  ratingComment: {
    type: String,
    default: '',
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);
