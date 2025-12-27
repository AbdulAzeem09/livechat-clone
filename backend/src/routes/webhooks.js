const express = require('express');
const router = express.Router();
const Webhook = require('../models/Webhook');
const { authenticate, authorize } = require('../middleware/auth');
const webhookService = require('../services/webhookService');
const { formatError, formatSuccess } = require('../utils/helpers');

router.get('/', authenticate, async (req, res) => {
  try {
    const webhooks = await Webhook.find();
    res.json(formatSuccess('Webhooks retrieved', webhooks));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving webhooks'));
  }
});

router.post('/', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const webhook = await Webhook.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(formatSuccess('Webhook created', webhook));
  } catch (error) {
    res.status(500).json(formatError('Error creating webhook'));
  }
});

router.post('/:id/test', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    await webhookService.testWebhook(req.params.id);
    res.json(formatSuccess('Test webhook sent'));
  } catch (error) {
    res.status(500).json(formatError('Error testing webhook'));
  }
});

router.put('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const webhook = await Webhook.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!webhook) return res.status(404).json(formatError('Webhook not found'));
    res.json(formatSuccess('Webhook updated', webhook));
  } catch (error) {
    res.status(500).json(formatError('Error updating webhook'));
  }
});

router.delete('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    await Webhook.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('Webhook deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting webhook'));
  }
});

module.exports = router;
