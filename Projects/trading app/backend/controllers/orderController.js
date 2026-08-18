const tradingService = require('../services/tradingService');
const Order = require('../models/Order');
const { successResponse } = require('../utils/apiResponse');

const buyStock = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;
    const result = await tradingService.executeBuyOrder(req.user._id, symbol, quantity);
    return successResponse(res, result, `Successfully purchased ${quantity} shares of ${symbol.toUpperCase()}`, 201);
  } catch (error) {
    next(error);
  }
};

const sellStock = async (req, res, next) => {
  try {
    const { symbol, quantity } = req.body;
    const result = await tradingService.executeSellOrder(req.user._id, symbol, quantity);
    return successResponse(res, result, `Successfully sold ${quantity} shares of ${symbol.toUpperCase()}`, 201);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user._id };
    if (req.query.symbol) {
      filter.symbol = req.query.symbol.toUpperCase();
    }
    if (req.query.side) {
      filter.side = req.query.side.toUpperCase();
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return successResponse(
      res,
      {
        orders,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
      'Orders retrieved'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  buyStock,
  sellStock,
  getOrders,
};
