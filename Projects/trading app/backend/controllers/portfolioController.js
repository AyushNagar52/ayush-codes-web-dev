const portfolioService = require('../services/portfolioService');
const { successResponse } = require('../utils/apiResponse');

const getSummary = async (req, res, next) => {
  try {
    const summary = await portfolioService.getPortfolioSummary(req.user._id);
    return successResponse(res, summary, 'Portfolio summary retrieved');
  } catch (error) {
    next(error);
  }
};

const getHoldings = async (req, res, next) => {
  try {
    const holdings = await portfolioService.getUserHoldings(req.user._id);
    return successResponse(res, holdings, 'Holdings retrieved');
  } catch (error) {
    next(error);
  }
};

const getPerformance = async (req, res, next) => {
  try {
    const { range } = req.query;
    const performance = await portfolioService.getPortfolioPerformance(req.user._id, range);
    return successResponse(res, performance, 'Performance history retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getHoldings,
  getPerformance,
};
