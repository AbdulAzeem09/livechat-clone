const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Tag = require('../models/Tag');

// @route   GET /api/tags
// @desc    Get all tags
// @access  Protected
router.get('/', auth, async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    
    if (category) {
      query.category = category;
    }

    const tags = await Tag.find(query).sort({ usageCount: -1 });
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tags/:id
// @desc    Get tag by ID
// @access  Protected
router.get('/:id', auth, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    
    res.json(tag);
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tags
// @desc    Create tag
// @access  Protected
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Tag name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, color, description, category } = req.body;

      const tag = new Tag({
        name,
        color: color || '#3B82F6',
        description,
        category: category || 'custom',
        createdBy: req.user.id,
      });

      await tag.save();
      res.status(201).json(tag);
    } catch (error) {
      console.error('Create tag error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Tag name already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/tags/:id
// @desc    Update tag
// @access  Protected
router.put('/:id', auth, async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tags/:id
// @desc    Delete tag
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
