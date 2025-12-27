const mongoose = require('mongoose');

const businessHoursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  timezone: {
    type: String,
    required: true,
    default: 'UTC',
  },
  schedule: {
    monday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    tuesday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    wednesday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    thursday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    friday: {
      enabled: { type: Boolean, default: true },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    saturday: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
    sunday: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
    },
  },
  holidays: [{
    name: String,
    date: Date,
  }],
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('BusinessHours', businessHoursSchema);
