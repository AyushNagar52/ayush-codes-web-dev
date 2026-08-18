const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Holding = require('../models/Holding');
const { roundCurrency } = require('../utils/financialMath');

/**
 * Platform telemetry and trading statistics
 */
const getPlatformStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const executedOrders = await Order.countDocuments({ status: 'EXECUTED' });
  const buyOrders = await Order.countDocuments({ side: 'BUY', status: 'EXECUTED' });
  const sellOrders = await Order.countDocuments({ side: 'SELL', status: 'EXECUTED' });

  // Aggregate total simulated trading volume ($)
  const volumeAgg = await Order.aggregate([
    { $match: { status: 'EXECUTED' } },
    { $group: { _id: null, totalVolume: { $sum: '$totalAmount' } } },
  ]);
  const totalVolume = volumeAgg.length > 0 ? roundCurrency(volumeAgg[0].totalVolume) : 0;

  // Aggregate most traded stocks
  const topStocksAgg = await Order.aggregate([
    { $match: { status: 'EXECUTED' } },
    {
      $group: {
        _id: '$symbol',
        companyName: { $first: '$companyName' },
        tradeCount: { $sum: 1 },
        totalShares: { $sum: '$quantity' },
        totalValue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { tradeCount: -1 } },
    { $limit: 5 },
  ]);

  // Recent 5 system orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId', 'name username email')
    .lean();

  return {
    totalUsers,
    totalOrders,
    executedOrders,
    buyOrders,
    sellOrders,
    totalVolume,
    topTradedStocks: topStocksAgg.map((s) => ({
      symbol: s._id,
      companyName: s.companyName,
      tradeCount: s.tradeCount,
      totalShares: s.totalShares,
      totalValue: roundCurrency(s.totalValue),
    })),
    recentOrders,
  };
};

/**
 * Paginated list of users with portfolio metrics
 */
const getAdminUsersList = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const enrichedUsers = await Promise.all(
    users.map(async (u) => {
      const portfolio = await Portfolio.findOne({ userId: u._id }).lean();
      const holdingsCount = await Holding.countDocuments({ userId: u._id });
      const ordersCount = await Order.countDocuments({ userId: u._id });

      return {
        ...u,
        cashBalance: portfolio ? portfolio.cashBalance : 0,
        initialCapital: portfolio ? portfolio.initialCapital : 0,
        holdingsCount,
        ordersCount,
      };
    })
  );

  return {
    users: enrichedUsers,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

module.exports = {
  getPlatformStats,
  getAdminUsersList,
};
