const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { departmentValidation } = require('../utils/validators');
const { formatError, formatSuccess } = require('../utils/helpers');

router.get('/', authenticate, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).populate('agents', 'name email');
    res.json(formatSuccess('Departments retrieved', departments));
  } catch (error) {
    res.status(500).json(formatError('Error retrieving departments'));
  }
});

router.post('/', authenticate, authorize('admin', 'super_admin'), departmentValidation, validate, async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(formatSuccess('Department created', department));
  } catch (error) {
    res.status(500).json(formatError('Error creating department'));
  }
});

router.put('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) return res.status(404).json(formatError('Department not found'));
    res.json(formatSuccess('Department updated', department));
  } catch (error) {
    res.status(500).json(formatError('Error updating department'));
  }
});

router.delete('/:id', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json(formatSuccess('Department deleted'));
  } catch (error) {
    res.status(500).json(formatError('Error deleting department'));
  }
});

module.exports = router;
