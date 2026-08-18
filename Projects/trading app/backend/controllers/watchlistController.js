const Watchlist = require('../models/Watchlist');
const marketService = require('../services/marketService');
const { successResponse } = require('../utils/apiResponse');
const AppError = require('../utils/customError');

const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id }).lean();

    // Fetch quotes in parallel
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const quote = await marketService.getStockQuote(item.symbol);
        return {
          _id: item._id,
          symbol: item.symbol,
          companyName: item.companyName || quote.companyName,
          quote: {
            price: quote.c,
            change: quote.d,
            changePercent: quote.dp,
            high: quote.h,
            low: quote.l,
            previousClose: quote.pc,
          },
        };
      })
    );

    return successResponse(res, enrichedItems, 'Watchlist retrieved');
  } catch (error) {
    next(error);
  }
};

const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    if (!symbol) {
      throw new AppError('Stock symbol is required', 400);
    }
    const cleanSymbol = symbol.toUpperCase().trim();

    const existing = await Watchlist.findOne({ userId: req.user._id, symbol: cleanSymbol });
    if (existing) {
      throw new AppError('Stock is already in your watchlist', 409);
    }

    const quote = await marketService.getStockQuote(cleanSymbol);
    const item = await Watchlist.create({
      userId: req.user._id,
      symbol: cleanSymbol,
      companyName: quote.companyName || `${cleanSymbol} Corp`,
    });

    return successResponse(res, item, `${cleanSymbol} added to watchlist`, 201);
  } catch (error) {
    next(error);
  }
};

const removeFromWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const cleanSymbol = symbol.toUpperCase().trim();

    const result = await Watchlist.findOneAndDelete({
      userId: req.user._id,
      symbol: cleanSymbol,
    });

    if (!result) {
      throw new AppError('Item not found in watchlist', 404);
    }

    return successResponse(res, null, `${cleanSymbol} removed from watchlist`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
