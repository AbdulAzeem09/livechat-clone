const express = require('express');
const router = express.Router();
const CannedResponse = require('../models/CannedResponse');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/canned-responses
 * @desc    Get all canned responses
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = {};
    if (category) {
      query.category = category;
    }

    const cannedResponses = await CannedResponse.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(cannedResponses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /api/canned-responses/:id
 * @desc    Get single canned response
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const cannedResponse = await CannedResponse.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!cannedResponse) {
      return res.status(404).json({ message: 'Canned response not found' });
    }

    res.json(cannedResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /api/canned-responses
 * @desc    Create canned response
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, shortcut, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const cannedResponse = await CannedResponse.create({
      title,
      content,
      shortcut: shortcut || '',
      category: category || 'General',
      createdBy: req.user._id,
    });

    res.status(201).json(cannedResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   PUT /api/canned-responses/:id
 * @desc    Update canned response
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const cannedResponse = await CannedResponse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!cannedResponse) {
      return res.status(404).json({ message: 'Canned response not found' });
    }

    res.json(cannedResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   DELETE /api/canned-responses/:id
 * @desc    Delete canned response
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const cannedResponse = await CannedResponse.findByIdAndDelete(req.params.id);

    if (!cannedResponse) {
      return res.status(404).json({ message: 'Canned response not found' });
    }

    res.json({ message: 'Canned response deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
