/**
 * Financial Calculation Utilities
 */

/**
 * Calculates new weighted average cost (WAC) when buying additional shares
 */
const calculateWeightedAverageCost = (existingQty, existingAvgPrice, newQty, purchasePrice) => {
  const currentTotal = (existingQty || 0) * (existingAvgPrice || 0);
  const additionalTotal = newQty * purchasePrice;
  const totalQty = (existingQty || 0) + newQty;
  if (totalQty === 0) return 0;
  return Number(( (currentTotal + additionalTotal) / totalQty ).toFixed(4));
};

/**
 * Calculates realized profit/loss on sale of shares
 */
const calculateRealizedPnL = (soldQty, sellPrice, averageBuyPrice) => {
  return Number(( (sellPrice - averageBuyPrice) * soldQty ).toFixed(2));
};

/**
 * Calculates unrealized profit/loss on active holding
 */
const calculateUnrealizedPnL = (qty, currentPrice, averageBuyPrice) => {
  const diff = currentPrice - averageBuyPrice;
  const pnlAmount = Number((diff * qty).toFixed(2));
  const pnlPercentage = averageBuyPrice > 0 ? Number(((diff / averageBuyPrice) * 100).toFixed(2)) : 0;
  return { pnlAmount, pnlPercentage };
};

/**
 * Rounds to 2 decimal places (standard currency)
 */
const roundCurrency = (val) => {
  return Math.round((val + Number.EPSILON) * 100) / 100;
};

module.exports = {
  calculateWeightedAverageCost,
  calculateRealizedPnL,
  calculateUnrealizedPnL,
  roundCurrency,
};
