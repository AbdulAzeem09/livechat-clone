const mongoose = require('mongoose');

const businessHoursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Business hours name is required'],
    trim: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  schedule: {
    0: { // Sunday
      enabled: {
        type: Boolean,
        default: false,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
    1: { // Monday
      enabled: {
        type: Boolean,
        default: true,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
    2: { // Tuesday
      enabled: {
        type: Boolean,
        default: true,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
    3: { // Wednesday
      enabled: {
        type: Boolean,
        default: true,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
    4: { // Thursday
      enabled: {
        type: Boolean,
        default: true,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
    5: { // Friday
      enabled: {
        type: Boolean,
        default: true,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
    6: { // Saturday
      enabled: {
        type: Boolean,
        default: false,
      },
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
  },
  holidays: [{
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Check if currently within business hours
businessHoursSchema.methods.isCurrentlyOpen = function() {
  if (!this.enabled) return true;
  
  const now = new Date();
  const day = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Check if today is a holiday
  const today = new Date().setHours(0, 0, 0, 0);
  const isHoliday = this.holidays.some(h => 
    new Date(h.date).setHours(0, 0, 0, 0) === today
  );
  
  if (isHoliday) return false;
  
  const daySchedule = this.schedule[day];
  if (!daySchedule || !daySchedule.enabled) return false;
  
  const [startHour, startMin] = daySchedule.start.split(':').map(Number);
  const [endHour, endMin] = daySchedule.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  return currentTime >= startTime && currentTime <= endTime;
};

module.exports = mongoose.model('BusinessHours', businessHoursSchema);
