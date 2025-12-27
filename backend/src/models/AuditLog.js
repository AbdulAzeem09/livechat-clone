const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true, // e.g., 'conversation', 'message', 'user', 'settings'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

// Index for efficient querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
