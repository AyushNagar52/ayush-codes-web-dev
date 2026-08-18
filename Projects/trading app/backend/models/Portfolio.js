const mongoose = require('mongoose');
const { INITIAL_CAPITAL } = require('../config/constants');

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    initialCapital: {
      type: Number,
      required: true,
      default: INITIAL_CAPITAL,
      min: [0, 'Initial capital cannot be negative'],
    },
    cashBalance: {
      type: Number,
      required: true,
      default: INITIAL_CAPITAL,
      min: [0, 'Cash balance cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
