const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Holding = require('../models/Holding');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Watchlist = require('../models/Watchlist');
const { INITIAL_CAPITAL } = require('./constants');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paper_trading_db');
    console.log('[Seed] Connected to MongoDB');

    // Clean existing data
    await User.deleteMany({});
    await Portfolio.deleteMany({});
    await Holding.deleteMany({});
    await Order.deleteMany({});
    await Transaction.deleteMany({});
    await Watchlist.deleteMany({});

    console.log('[Seed] Database wiped clean');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@papertrade.com',
      password: 'AdminPassword123!',
      role: 'admin',
    });

    await Portfolio.create({
      userId: admin._id,
      initialCapital: INITIAL_CAPITAL,
      cashBalance: INITIAL_CAPITAL,
    });

    console.log(`[Seed] Admin created: admin@papertrade.com / AdminPassword123!`);

    // 2. Create Demo Trader User
    const trader = await User.create({
      name: 'Ayush Trader',
      username: 'ayushtrader',
      email: 'trader@papertrade.com',
      password: 'TraderPassword123!',
      role: 'user',
    });

    // Seed Trader Initial Holdings: NVDA, AAPL, MSFT
    const nvdaPrice = 124.50;
    const nvdaQty = 100;
    const nvdaTotal = nvdaPrice * nvdaQty; // 12,450

    const aaplPrice = 225.00;
    const aaplQty = 80;
    const aaplTotal = aaplPrice * aaplQty; // 18,000

    const msftPrice = 415.00;
    const msftQty = 50;
    const msftTotal = msftPrice * msftQty; // 20,750

    const totalInvested = nvdaTotal + aaplTotal + msftTotal; // 51,200
    const remainingCash = INITIAL_CAPITAL - totalInvested; // 48,800

    await Portfolio.create({
      userId: trader._id,
      initialCapital: INITIAL_CAPITAL,
      cashBalance: remainingCash,
    });

    // Create Holdings
    await Holding.create([
      {
        userId: trader._id,
        symbol: 'NVDA',
        companyName: 'NVIDIA Corporation',
        quantity: nvdaQty,
        averageBuyPrice: nvdaPrice,
        totalInvested: nvdaTotal,
      },
      {
        userId: trader._id,
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        quantity: aaplQty,
        averageBuyPrice: aaplPrice,
        totalInvested: aaplTotal,
      },
      {
        userId: trader._id,
        symbol: 'MSFT',
        companyName: 'Microsoft Corporation',
        quantity: msftQty,
        averageBuyPrice: msftPrice,
        totalInvested: msftTotal,
      },
    ]);

    // Create Orders
    const o1 = await Order.create({
      userId: trader._id,
      symbol: 'NVDA',
      companyName: 'NVIDIA Corporation',
      side: 'BUY',
      quantity: nvdaQty,
      executionPrice: nvdaPrice,
      totalAmount: nvdaTotal,
      status: 'EXECUTED',
      createdAt: new Date(Date.now() - 3 * 86400000),
    });

    const o2 = await Order.create({
      userId: trader._id,
      symbol: 'AAPL',
      companyName: 'Apple Inc.',
      side: 'BUY',
      quantity: aaplQty,
      executionPrice: aaplPrice,
      totalAmount: aaplTotal,
      status: 'EXECUTED',
      createdAt: new Date(Date.now() - 2 * 86400000),
    });

    const o3 = await Order.create({
      userId: trader._id,
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      side: 'BUY',
      quantity: msftQty,
      executionPrice: msftPrice,
      totalAmount: msftTotal,
      status: 'EXECUTED',
      createdAt: new Date(Date.now() - 1 * 86400000),
    });

    // Create Transactions
    await Transaction.create([
      {
        userId: trader._id,
        orderId: o1._id,
        type: 'BUY_STOCK',
        symbol: 'NVDA',
        quantity: nvdaQty,
        pricePerShare: nvdaPrice,
        totalAmount: nvdaTotal,
        cashBalanceBefore: 100000,
        cashBalanceAfter: 100000 - nvdaTotal,
        createdAt: new Date(Date.now() - 3 * 86400000),
      },
      {
        userId: trader._id,
        orderId: o2._id,
        type: 'BUY_STOCK',
        symbol: 'AAPL',
        quantity: aaplQty,
        pricePerShare: aaplPrice,
        totalAmount: aaplTotal,
        cashBalanceBefore: 100000 - nvdaTotal,
        cashBalanceAfter: 100000 - nvdaTotal - aaplTotal,
        createdAt: new Date(Date.now() - 2 * 86400000),
      },
      {
        userId: trader._id,
        orderId: o3._id,
        type: 'BUY_STOCK',
        symbol: 'MSFT',
        quantity: msftQty,
        pricePerShare: msftPrice,
        totalAmount: msftTotal,
        cashBalanceBefore: 100000 - nvdaTotal - aaplTotal,
        cashBalanceAfter: remainingCash,
        createdAt: new Date(Date.now() - 1 * 86400000),
      },
    ]);

    // Create Watchlist items
    await Watchlist.create([
      { userId: trader._id, symbol: 'TSLA', companyName: 'Tesla Inc.' },
      { userId: trader._id, symbol: 'AMZN', companyName: 'Amazon.com Inc.' },
      { userId: trader._id, symbol: 'META', companyName: 'Meta Platforms Inc.' },
      { userId: trader._id, symbol: 'AMD', companyName: 'Advanced Micro Devices Inc.' },
    ]);

    console.log(`[Seed] Demo Trader created: trader@papertrade.com / TraderPassword123!`);
    console.log('[Seed] Database seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
