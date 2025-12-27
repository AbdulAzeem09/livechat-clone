const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const BusinessHours = require('../models/BusinessHours');

// @route   GET /api/business-hours
// @desc    Get all business hours
// @access  Protected (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const businessHours = await BusinessHours.find().sort({ isDefault: -1, createdAt: -1 });
    res.json(businessHours);
  } catch (error) {
    console.error('Get business hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/business-hours/default
// @desc    Get default business hours
// @access  Public
router.get('/default', async (req, res) => {
  try {
    const businessHours = await BusinessHours.findOne({ isDefault: true });
    
    if (!businessHours) {
      return res.status(404).json({ message: 'Default business hours not found' });
    }
    
    res.json(businessHours);
  } catch (error) {
    console.error('Get default business hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/business-hours/:id
// @desc    Get business hours by ID
// @access  Protected
router.get('/:id', auth, async (req, res) => {
  try {
    const businessHours = await BusinessHours.findById(req.params.id);
    
    if (!businessHours) {
      return res.status(404).json({ message: 'Business hours not found' });
    }
    
    res.json(businessHours);
  } catch (error) {
    console.error('Get business hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/business-hours
// @desc    Create business hours
// @access  Protected (Admin only)
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Name is required'),
    body('timezone').notEmpty().withMessage('Timezone is required'),
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
      const { name, timezone, schedule, holidays, isDefault } = req.body;

      // If setting as default, unset other defaults
      if (isDefault) {
        await BusinessHours.updateMany(
          { isDefault: true },
          { $set: { isDefault: false } }
        );
      }

      const businessHours = new BusinessHours({
        name,
        timezone,
        schedule: schedule || {},
        holidays: holidays || [],
        isDefault: isDefault || false,
      });

      await businessHours.save();
      res.status(201).json(businessHours);
    } catch (error) {
      console.error('Create business hours error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/business-hours/:id
// @desc    Update business hours
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    // If setting as default, unset other defaults
    if (req.body.isDefault === true) {
      await BusinessHours.updateMany(
        { _id: { $ne: req.params.id }, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    const businessHours = await BusinessHours.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!businessHours) {
      return res.status(404).json({ message: 'Business hours not found' });
    }

    res.json(businessHours);
  } catch (error) {
    console.error('Update business hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/business-hours/:id
// @desc    Delete business hours
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const businessHours = await BusinessHours.findById(req.params.id);

    if (!businessHours) {
      return res.status(404).json({ message: 'Business hours not found' });
    }

    if (businessHours.isDefault) {
      return res.status(400).json({ message: 'Cannot delete default business hours' });
    }

    await businessHours.deleteOne();
    res.json({ message: 'Business hours deleted successfully' });
  } catch (error) {
    console.error('Delete business hours error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
