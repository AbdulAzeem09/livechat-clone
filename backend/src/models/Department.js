const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  agents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  email: {
    type: String,
    default: '',
    lowercase: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  settings: {
    autoAssignment: {
      type: Boolean,
      default: true,
    },
    assignmentMethod: {
      type: String,
      enum: ['round_robin', 'load_balancing', 'manual'],
      default: 'load_balancing',
    },
    maxWaitTime: {
      type: Number, // in minutes
      default: 5,
    },
  },
}, {
  timestamps: true,
});

// Index for faster queries
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });

// Get available agents in department
departmentSchema.methods.getAvailableAgents = async function() {
  const User = mongoose.model('User');
  return await User.find({
    _id: { $in: this.agents },
    status: { $in: ['online', 'away'] },
    isActive: true,
  });
};

module.exports = mongoose.model('Department', departmentSchema);
