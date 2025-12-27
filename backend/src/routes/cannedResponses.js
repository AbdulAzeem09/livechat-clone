const express = require('express');
const router = express.Router();
const CannedResponse = require('../models/CannedResponse');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { cannedResponseValidation } = require('../utils/validators');
const { formatError, formatSuccess } = require('../utils/helpers');

router.get('/', authenticate, async (req, res) => {
  try {
    const responses = await CannedResponse.find({ createdBy: req.user._id, isActive: true })
      .sort({ shortcut: 1 });
    res.json(formatSuccess('Canned responses retrieved', responses));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving canned responses'));
  }
});

router.post('/', authenticate, cannedResponseValidation, validate, async (req, res) => {
  try {
    const response = await CannedResponse.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(formatSuccess('Canned response created', response));
  } catch (error) {
    res.status(500).json(formatError('Error creating canned response'));
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const response = await CannedResponse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!response) return res.status(404).json(formatError('Canned response not found'));
    res.json(formatSuccess('Canned response updated', response));
  } catch (error) {
    res.status(500).json(formatError('Error updating canned response'));
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await CannedResponse.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('Canned response deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting canned response'));
  }
});

module.exports = router;
