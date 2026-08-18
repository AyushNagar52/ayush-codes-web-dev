const mongoose = require('mongoose');

const portfolioSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    portfolioValue: {
      type: Number,
      required: true,
    },
    cashBalance: {
      type: Number,
      required: true,
    },
    investedValue: {
      type: Number,
      required: true,
    },
    totalPnL: {
      type: Number,
      required: true,
    },
    snapshotDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSnapshotSchema.index({ userId: 1, snapshotDate: -1 });

module.exports = mongoose.model('PortfolioSnapshot', portfolioSnapshotSchema);
