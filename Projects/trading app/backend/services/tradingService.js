const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const Holding = require('../models/Holding');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const marketService = require('./marketService');
const AppError = require('../utils/customError');
const { calculateWeightedAverageCost, calculateRealizedPnL, roundCurrency } = require('../utils/financialMath');

/**
 * Executes a Market BUY Order
 */
const executeBuyOrder = async (userId, symbol, quantity) => {
  if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
    throw new AppError('Quantity must be an integer of at least 1 share', 400);
  }

  const cleanSymbol = symbol.toUpperCase().trim();

  // 1. Resolve live market price
  const quote = await marketService.getStockQuote(cleanSymbol);
  const executionPrice = quote.c;
  const companyName = quote.companyName || `${cleanSymbol} Corp`;
  const totalCost = roundCurrency(executionPrice * quantity);

  // 2. Start Mongoose session & transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Find portfolio and verify cash balance
    const portfolio = await Portfolio.findOne({ userId }).session(session);
    if (!portfolio) {
      throw new AppError('Portfolio not found for this user', 404);
    }

    if (portfolio.cashBalance < totalCost) {
      throw new AppError(
        `Insufficient funds. Order requires $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })} but available cash is $${portfolio.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        422
      );
    }

    const cashBefore = portfolio.cashBalance;
    const cashAfter = roundCurrency(cashBefore - totalCost);

    // 4. Deduct cash balance
    portfolio.cashBalance = cashAfter;
    await portfolio.save({ session });

    // 5. Query or Create Holding with Weighted Average Cost (WAC)
    let holding = await Holding.findOne({ userId, symbol: cleanSymbol }).session(session);

    if (holding) {
      const newWac = calculateWeightedAverageCost(
        holding.quantity,
        holding.averageBuyPrice,
        quantity,
        executionPrice
      );
      holding.quantity += quantity;
      holding.averageBuyPrice = newWac;
      holding.totalInvested = roundCurrency(holding.quantity * newWac);
      await holding.save({ session });
    } else {
      holding = await Holding.create(
        [
          {
            userId,
            symbol: cleanSymbol,
            companyName,
            quantity,
            averageBuyPrice: executionPrice,
            totalInvested: totalCost,
          },
        ],
        { session }
      );
      holding = holding[0];
    }

    // 6. Create Order record
    const order = await Order.create(
      [
        {
          userId,
          symbol: cleanSymbol,
          companyName,
          side: 'BUY',
          type: 'MARKET',
          quantity,
          executionPrice,
          totalAmount: totalCost,
          status: 'EXECUTED',
        },
      ],
      { session }
    );

    // 7. Create Transaction Ledger entry
    await Transaction.create(
      [
        {
          userId,
          orderId: order[0]._id,
          type: 'BUY_STOCK',
          symbol: cleanSymbol,
          quantity,
          pricePerShare: executionPrice,
          totalAmount: totalCost,
          cashBalanceBefore: cashBefore,
          cashBalanceAfter: cashAfter,
        },
      ],
      { session }
    );

    // 8. Commit ACID transaction
    await session.commitTransaction();
    session.endSession();

    return {
      order: order[0],
      holding,
      updatedCashBalance: cashAfter,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Executes a Market SELL Order
 */
const executeSellOrder = async (userId, symbol, quantity) => {
  if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
    throw new AppError('Quantity must be an integer of at least 1 share', 400);
  }

  const cleanSymbol = symbol.toUpperCase().trim();

  // 1. Resolve live market price
  const quote = await marketService.getStockQuote(cleanSymbol);
  const executionPrice = quote.c;
  const companyName = quote.companyName || `${cleanSymbol} Corp`;
  const totalProceeds = roundCurrency(executionPrice * quantity);

  // 2. Start Mongoose session & transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 3. Find holding and verify quantity
    const holding = await Holding.findOne({ userId, symbol: cleanSymbol }).session(session);
    if (!holding || holding.quantity < quantity) {
      const availableShares = holding ? holding.quantity : 0;
      throw new AppError(
        `Insufficient shares to sell. You requested to sell ${quantity} shares of ${cleanSymbol}, but currently own ${availableShares} shares.`,
        422
      );
    }

    // 4. Calculate Realized PnL
    const realizedPnL = calculateRealizedPnL(quantity, executionPrice, holding.averageBuyPrice);

    // 5. Update portfolio cash balance
    const portfolio = await Portfolio.findOne({ userId }).session(session);
    if (!portfolio) {
      throw new AppError('Portfolio not found', 404);
    }

    const cashBefore = portfolio.cashBalance;
    const cashAfter = roundCurrency(cashBefore + totalProceeds);

    portfolio.cashBalance = cashAfter;
    await portfolio.save({ session });

    // 6. Update or Remove Holding
    const remainingQty = holding.quantity - quantity;
    let updatedHolding = null;

    if (remainingQty === 0) {
      await Holding.deleteOne({ _id: holding._id }).session(session);
    } else {
      holding.quantity = remainingQty;
      holding.totalInvested = roundCurrency(remainingQty * holding.averageBuyPrice);
      await holding.save({ session });
      updatedHolding = holding;
    }

    // 7. Create Order record
    const order = await Order.create(
      [
        {
          userId,
          symbol: cleanSymbol,
          companyName,
          side: 'SELL',
          type: 'MARKET',
          quantity,
          executionPrice,
          totalAmount: totalProceeds,
          status: 'EXECUTED',
        },
      ],
      { session }
    );

    // 8. Create Transaction Ledger entry
    await Transaction.create(
      [
        {
          userId,
          orderId: order[0]._id,
          type: 'SELL_STOCK',
          symbol: cleanSymbol,
          quantity,
          pricePerShare: executionPrice,
          totalAmount: totalProceeds,
          realizedPnL,
          cashBalanceBefore: cashBefore,
          cashBalanceAfter: cashAfter,
        },
      ],
      { session }
    );

    // 9. Commit ACID transaction
    await session.commitTransaction();
    session.endSession();

    return {
      order: order[0],
      holding: updatedHolding,
      realizedPnL,
      updatedCashBalance: cashAfter,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = {
  executeBuyOrder,
  executeSellOrder,
};
