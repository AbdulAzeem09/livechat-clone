const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Department = require('../models/Department');
const User = require('../models/User');

// @route   GET /api/departments
// @desc    Get all departments
// @access  Protected
router.get('/', auth, async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('agents', 'name email status')
      .populate('businessHours');
    
    res.json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Protected
router.get('/:id', auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('agents', 'name email status currentChatCount maxConcurrentChats')
      .populate('businessHours');
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments
// @desc    Create department
// @access  Protected (Admin only)
router.post('/',
  [
    auth,
    body('name').notEmpty().withMessage('Department name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    try {
      const { name, description, email, agents, businessHours, maxConcurrentChats } = req.body;

      const department = new Department({
        name,
        description,
        email,
        agents,
        businessHours,
        maxConcurrentChats,
      });

      await department.save();
      await department.populate('agents', 'name email');

      res.status(201).json(department);
    } catch (error) {
      console.error('Create department error:', error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Department name already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Protected (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('agents', 'name email');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments/:id/agents
// @desc    Add agent to department
// @access  Protected (Admin only)
router.post('/:id/agents', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { agentId } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (!department.agents.includes(agentId)) {
      department.agents.push(agentId);
      await department.save();

      // Update user's department
      await User.findByIdAndUpdate(agentId, { department: department._id });
    }

    await department.populate('agents', 'name email status');
    res.json(department);
  } catch (error) {
    console.error('Add agent to department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/departments/:id/agents/:agentId
// @desc    Remove agent from department
// @access  Protected (Admin only)
router.delete('/:id/agents/:agentId', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.agents = department.agents.filter(
      agent => agent.toString() !== req.params.agentId
    );
    await department.save();

    await department.populate('agents', 'name email status');
    res.json(department);
  } catch (error) {
    console.error('Remove agent from department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
