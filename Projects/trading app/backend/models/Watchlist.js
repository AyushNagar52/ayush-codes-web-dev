const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
    },
    companyName: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
