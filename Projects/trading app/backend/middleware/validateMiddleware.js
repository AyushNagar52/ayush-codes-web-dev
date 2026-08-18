const { validationResult } = require('express-validator');
const AppError = require('../utils/customError');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));
    return next(new AppError(formattedErrors[0].message, 400, formattedErrors));
  }
  next();
};

module.exports = { handleValidationErrors };
