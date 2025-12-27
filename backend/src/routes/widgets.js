const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Widget = require('../models/Widget');
const crypto = require('crypto');

// @route   GET /api/widgets
// @desc    Get all widgets
// @access  Protected (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const widgets = await Widget.find()
      .populate('department', 'name')
      .populate('businessHours', 'name')
      .sort({ createdAt: -1 });
    res.json(widgets);
  } catch (error) {
    console.error('Get widgets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/widgets/:id
// @desc    Get widget by ID or widgetId
// @access  Public (for widget embedding)
router.get('/:id', async (req, res) => {
  try {
    const widget = await Widget.findOne({
      $or: [
        { _id: req.params.id },
        { widgetId: req.params.id }
      ]
    })
    .populate('department', 'name')
    .populate('businessHours');
    
    if (!widget) {
      return res.status(404).json({ message: 'Widget not found' });
    }
    
    res.json(widget);
  } catch (error) {
    console.error('Get widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/widgets
// @desc    Create widget
// @access  Protected (Admin only)
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Widget name is required'),
    body('domain').notEmpty().withMessage('Domain is required'),
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
      const { name, domain, appearance, preChatForm, department, businessHours } = req.body;

      // Generate unique widget ID
      const widgetId = crypto.randomBytes(16).toString('hex');

      const widget = new Widget({
        name,
        widgetId,
        domain,
        appearance: appearance || {},
        preChatForm: preChatForm || { enabled: true, fields: [] },
        department,
        businessHours,
      });

      await widget.save();
      await widget.populate('department', 'name');
      
      res.status(201).json(widget);
    } catch (error) {
      console.error('Create widget error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/widgets/:id
// @desc    Update widget
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const widget = await Widget.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('department', 'name').populate('businessHours', 'name');

    if (!widget) {
      return res.status(404).json({ message: 'Widget not found' });
    }

    res.json(widget);
  } catch (error) {
    console.error('Update widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/widgets/:id
// @desc    Delete widget
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const widget = await Widget.findByIdAndDelete(req.params.id);

    if (!widget) {
      return res.status(404).json({ message: 'Widget not found' });
    }

    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error('Delete widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/widgets/:id/toggle
// @desc    Toggle widget active status
// @access  Protected (Admin only)
router.put('/:id/toggle', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const widget = await Widget.findById(req.params.id);
    
    if (!widget) {
      return res.status(404).json({ message: 'Widget not found' });
    }

    widget.isActive = !widget.isActive;
    await widget.save();

    res.json(widget);
  } catch (error) {
    console.error('Toggle widget error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
