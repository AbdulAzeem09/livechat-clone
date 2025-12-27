const { validationResult } = require('express-validator');
const { formatError } = require('../utils/helpers');

/**
 * Validate request based on validation rules
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json(
      formatError('Validation failed', extractedErrors)
    );
  }

  next();
};

module.exports = validate;
