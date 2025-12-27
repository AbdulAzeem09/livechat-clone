const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/visitors
 * @desc    Get all visitors
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, online } = req.query;
    
    const query = {};
    if (online !== undefined) {
      query.isOnline = online === 'true';
    }

    const visitors = await Visitor.find(query)
      .sort({ lastSeen: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Visitor.countDocuments(query);

    res.json({
      visitors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/visitors/:id
 * @desc    Get single visitor
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/visitors/:id
 * @desc    Update visitor information
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
