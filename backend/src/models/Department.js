const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  agents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  email: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  businessHours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessHours',
  },
  maxConcurrentChats: {
    type: Number,
    default: 5,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Department', departmentSchema);
