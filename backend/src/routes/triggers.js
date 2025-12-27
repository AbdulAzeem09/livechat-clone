const express = require('express');
const router = express.Router();
const Trigger = require('../models/Trigger');
const { authenticate, authorize } = require('../middleware/auth');
const { formatError, formatSuccess } = require('../utils/helpers');

router.get('/', authenticate, async (req, res) => {
  try {
    const triggers = await Trigger.find().sort({ priority: -1 });
    res.json(formatSuccess('Triggers retrieved', triggers));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving triggers'));
  }
});

router.post('/', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const trigger = await Trigger.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(formatSuccess('Trigger created', trigger));
  } catch (error) {
    res.status(500).json(formatError('Error creating trigger'));
  }
});

router.put('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const trigger = await Trigger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trigger) return res.status(404).json(formatError('Trigger not found'));
    res.json(formatSuccess('Trigger updated', trigger));
  } catch (error) {
    res.status(500).json(formatError('Error updating trigger'));
  }
});

router.delete('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    await Trigger.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('Trigger deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting trigger'));
  }
});

module.exports = router;
