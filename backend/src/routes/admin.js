const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { authenticate, authorize } = require('../middleware/auth');
const { formatError, formatSuccess, paginate, getPaginationMeta } = require('../utils/helpers');

/**
 * Get all users
 */
router.get('/users', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const total = await User.countDocuments();
    const users = await User.find()
      .populate('departments', 'name')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const meta = getPaginationMeta(total, parseInt(page), limitNum);

    res.json(formatSuccess('Users retrieved', { users, meta }));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving users'));
  }
});

/**
 * Update user
 */
router.put('/users/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json(formatError('User not found'));
    res.json(formatSuccess('User updated', user));
  } catch (error) {
    res.status(500).json(formatError('Error updating user'));
  }
});

/**
 * Delete user
 */
router.delete('/users/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('User deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting user'));
  }
});

/**
 * Get audit logs
 */
router.get('/audit-logs', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const { skip, limit: limitNum } = paginate(page, limit);

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const meta = getPaginationMeta(total, parseInt(page), limitNum);

    res.json(formatSuccess('Audit logs retrieved', { logs, meta }));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving audit logs'));
  }
});

module.exports = router;
