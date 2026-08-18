const { body } = require('express-validator');

const orderValidator = [
  body('symbol')
    .trim()
    .notEmpty()
    .withMessage('Stock symbol is required')
    .isLength({ min: 1, max: 10 })
    .withMessage('Stock symbol must be between 1 and 10 characters')
    .toUpperCase(),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1 share')
    .toInt(),
];

module.exports = {
  orderValidator,
};
