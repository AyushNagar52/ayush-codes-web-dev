const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Holding quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    averageBuyPrice: {
      type: Number,
      required: [true, 'Average buy price is required'],
      min: [0.0001, 'Average buy price must be positive'],
    },
    totalInvested: {
      type: Number,
      required: true,
      min: [0, 'Total invested cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one holding per stock per user
holdingSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);
