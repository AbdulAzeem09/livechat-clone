const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const { authenticate } = require('../middleware/auth');
const { formatError, formatSuccess } = require('../utils/helpers');

router.get('/', authenticate, async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(formatSuccess('Tags retrieved', tags));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving tags'));
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const tag = await Tag.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(formatSuccess('Tag created', tag));
  } catch (error) {
    res.status(500).json(formatError('Error creating tag'));
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tag) return res.status(404).json(formatError('Tag not found'));
    res.json(formatSuccess('Tag updated', tag));
  } catch (error) {
    res.status(500).json(formatError('Error updating tag'));
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('Tag deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting tag'));
  }
});

module.exports = router;
