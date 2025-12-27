const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Webhook = require('../models/Webhook');
const webhookService = require('../services/webhookService');

// @route   GET /api/webhooks
// @desc    Get all webhooks
// @access  Protected (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const webhooks = await Webhook.find().sort({ createdAt: -1 });
    res.json(webhooks);
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/webhooks/:id
// @desc    Get webhook by ID
// @access  Protected (Admin only)
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const webhook = await Webhook.findById(req.params.id);
    
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    
    res.json(webhook);
  } catch (error) {
    console.error('Get webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/webhooks
// @desc    Create webhook
// @access  Protected (Admin only)
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Webhook name is required'),
    body('url').isURL().withMessage('Valid URL is required'),
    body('events').isArray().withMessage('Events must be an array'),
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
      const { name, url, events, secret, headers, retryPolicy } = req.body;

      const webhook = new Webhook({
        name,
        url,
        events,
        secret,
        headers: headers ? new Map(Object.entries(headers)) : undefined,
        retryPolicy,
      });

      await webhook.save();
      res.status(201).json(webhook);
    } catch (error) {
      console.error('Create webhook error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/webhooks/:id
// @desc    Update webhook
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const updateData = { ...req.body };
    
    if (updateData.headers) {
      updateData.headers = new Map(Object.entries(updateData.headers));
    }

    const webhook = await Webhook.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }

    res.json(webhook);
  } catch (error) {
    console.error('Update webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/webhooks/:id
// @desc    Delete webhook
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const webhook = await Webhook.findByIdAndDelete(req.params.id);

    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }

    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/webhooks/:id/test
// @desc    Test webhook connection
// @access  Protected (Admin only)
router.post('/:id/test', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const webhook = await Webhook.findById(req.params.id);
    
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }

    const result = await webhookService.testWebhook(webhook.url);
    res.json(result);
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
