const marketService = require('../services/marketService');
const { successResponse } = require('../utils/apiResponse');

const getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const quote = await marketService.getStockQuote(symbol);
    return successResponse(res, quote, 'Quote retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const results = await marketService.searchStocks(q || '');
    return successResponse(res, results, 'Search results retrieved');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const profile = await marketService.getCompanyProfile(symbol);
    return successResponse(res, profile, 'Company profile retrieved');
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { range } = req.query;
    const history = await marketService.getStockHistory(symbol, range || '1M');
    return successResponse(res, history, 'Price history retrieved');
  } catch (error) {
    next(error);
  }
};

const getOverview = async (req, res, next) => {
  try {
    const overview = await marketService.getMarketOverview();
    return successResponse(res, overview, 'Market overview retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQuote,
  search,
  getProfile,
  getHistory,
  getOverview,
};
