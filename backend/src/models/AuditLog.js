const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'user.created',
      'user.updated',
      'user.deleted',
      'conversation.created',
      'conversation.assigned',
      'conversation.transferred',
      'conversation.resolved',
      'conversation.closed',
      'message.sent',
      'message.edited',
      'message.deleted',
      'settings.updated',
      'department.created',
      'department.updated',
      'department.deleted',
      'trigger.created',
      'trigger.updated',
      'trigger.deleted',
      'webhook.created',
      'webhook.updated',
      'webhook.deleted',
      'widget.created',
      'widget.updated',
      'login.success',
      'login.failed',
      'logout',
    ],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resourceType: {
    type: String,
    enum: ['user', 'conversation', 'message', 'department', 'trigger', 'webhook', 'widget', 'settings'],
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

// Static method to log action
auditLogSchema.statics.log = async function(data) {
  return await this.create(data);
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
