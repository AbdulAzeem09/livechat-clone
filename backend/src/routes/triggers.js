const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Trigger = require('../models/Trigger');

// @route   GET /api/triggers
// @desc    Get all triggers
// @access  Protected (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const triggers = await Trigger.find().sort({ priority: -1, createdAt: -1 });
    res.json(triggers);
  } catch (error) {
    console.error('Get triggers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/triggers/active
// @desc    Get active triggers
// @access  Protected
router.get('/active', auth, async (req, res) => {
  try {
    const triggers = await Trigger.find({ isActive: true }).sort({ priority: -1 });
    res.json(triggers);
  } catch (error) {
    console.error('Get active triggers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/triggers/:id
// @desc    Get trigger by ID
// @access  Protected (Admin only)
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const trigger = await Trigger.findById(req.params.id);
    
    if (!trigger) {
      return res.status(404).json({ message: 'Trigger not found' });
    }
    
    res.json(trigger);
  } catch (error) {
    console.error('Get trigger error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/triggers
// @desc    Create trigger
// @access  Protected (Admin only)
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Trigger name is required'),
    body('conditions').notEmpty().withMessage('Conditions are required'),
    body('actions').isArray().withMessage('Actions must be an array'),
  ],
  async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, description, conditions, actions, priority } = req.body;

      const trigger = new Trigger({
        name,
        description,
        conditions,
        actions,
        priority: priority || 0,
      });

      await trigger.save();
      res.status(201).json(trigger);
    } catch (error) {
      console.error('Create trigger error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/triggers/:id
// @desc    Update trigger
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const trigger = await Trigger.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!trigger) {
      return res.status(404).json({ message: 'Trigger not found' });
    }

    res.json(trigger);
  } catch (error) {
    console.error('Update trigger error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/triggers/:id
// @desc    Delete trigger
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const trigger = await Trigger.findByIdAndDelete(req.params.id);

    if (!trigger) {
      return res.status(404).json({ message: 'Trigger not found' });
    }

    res.json({ message: 'Trigger deleted successfully' });
  } catch (error) {
    console.error('Delete trigger error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/triggers/:id/toggle
// @desc    Toggle trigger active status
// @access  Protected (Admin only)
router.put('/:id/toggle', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const trigger = await Trigger.findById(req.params.id);
    
    if (!trigger) {
      return res.status(404).json({ message: 'Trigger not found' });
    }

    trigger.isActive = !trigger.isActive;
    await trigger.save();

    res.json(trigger);
  } catch (error) {
    console.error('Toggle trigger error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
