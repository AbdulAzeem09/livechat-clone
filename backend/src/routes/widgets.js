const express = require('express');
const router = express.Router();
const Widget = require('../models/Widget');
const { authenticate, authorize } = require('../middleware/auth');
const { formatError, formatSuccess } = require('../utils/helpers');

router.get('/', authenticate, async (req, res) => {
  try {
    const widgets = await Widget.find();
    res.json(formatSuccess('Widgets retrieved', widgets));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving widgets'));
  }
});

router.get('/:id', async (req, res) => {
  try {
    const widget = await Widget.findById(req.params.id).populate('departments businessHours');
    if (!widget) return res.status(404).json(formatError('Widget not found'));
    res.json(formatSuccess('Widget retrieved', widget));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving widget'));
  }
});

router.post('/', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const widget = await Widget.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(formatSuccess('Widget created', widget));
  } catch (error) {
    res.status(500).json(formatError('Error creating widget'));
  }
});

router.put('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const widget = await Widget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!widget) return res.status(404).json(formatError('Widget not found'));
    res.json(formatSuccess('Widget updated', widget));
  } catch (error) {
    res.status(500).json(formatError('Error updating widget'));
  }
});

router.delete('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    await Widget.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('Widget deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting widget'));
  }
});

module.exports = router;
