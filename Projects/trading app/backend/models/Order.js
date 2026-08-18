const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
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
    side: {
      type: String,
      required: [true, 'Order side is required'],
      enum: ['BUY', 'SELL'],
    },
    type: {
      type: String,
      enum: ['MARKET'],
      default: 'MARKET',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1 share'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer quantity',
      },
    },
    executionPrice: {
      type: Number,
      required: [true, 'Execution price is required'],
      min: [0.0001, 'Price must be positive'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total order amount is required'],
      min: [0.0001, 'Total amount must be positive'],
    },
    status: {
      type: String,
      enum: ['EXECUTED', 'REJECTED'],
      default: 'EXECUTED',
    },
    rejectionReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ symbol: 1 });

module.exports = mongoose.model('Order', orderSchema);
