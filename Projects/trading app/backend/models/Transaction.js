const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['BUY_STOCK', 'SELL_STOCK'],
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerShare: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    realizedPnL: {
      type: Number,
      default: 0,
    },
    cashBalanceBefore: {
      type: Number,
      required: true,
    },
    cashBalanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
