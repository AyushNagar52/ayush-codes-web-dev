const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING PAPER TRADING PLATFORM E2E INTEGRATION TEST ===\n');

  try {
    // 1. Health Check
    console.log('1. Testing /api/health ...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✓ Health Status:', health.data.status, '\n');

    // 2. Register New Trader
    const testUsername = `trader_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;
    console.log(`2. Registering test user (${testEmail}) ...`);
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Integration Test Trader',
      username: testUsername,
      email: testEmail,
      password: 'TestPassword123!',
    });
    const { token, user } = regRes.data.data;
    console.log('✓ Registered User ID:', user.id);
    console.log('✓ JWT Token Acquired (starts with):', token.substring(0, 20) + '...\n');

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Verify Portfolio Initialization ($100k)
    console.log('3. Checking initialized portfolio ...');
    const portfolioRes = await axios.get(`${BASE_URL}/portfolio`, { headers: authHeaders });
    const pSummary = portfolioRes.data.data;
    console.log('✓ Initial Capital:', `$${pSummary.initialCapital}`);
    console.log('✓ Cash Balance:', `$${pSummary.cashBalance}`);
    console.log('✓ Total Net Worth:', `$${pSummary.totalPortfolioValue}\n`);

    if (pSummary.cashBalance !== 100000) {
      throw new Error(`Expected $100000 initial cash, got ${pSummary.cashBalance}`);
    }

    // 4. Test Market Overview and Quotes
    console.log('4. Testing market overview and quotes ...');
    const marketRes = await axios.get(`${BASE_URL}/market/overview`);
    console.log(`✓ Retrieved ${marketRes.data.data.allStocks.length} stock quotes.`);
    const nvdaQuote = await axios.get(`${BASE_URL}/market/quote/NVDA`);
    console.log(`✓ Live NVDA Quote: $${nvdaQuote.data.data.c} (${nvdaQuote.data.data.dp}%)\n`);

    // 5. Execute BUY Order (10 shares NVDA)
    console.log('5. Executing BUY Order (10 shares of NVDA) ...');
    const buyRes = await axios.post(
      `${BASE_URL}/orders/buy`,
      { symbol: 'NVDA', quantity: 10 },
      { headers: authHeaders }
    );
    const buyData = buyRes.data.data;
    console.log('✓ Order Executed:', buyData.order._id);
    console.log('✓ Execution Price:', `$${buyData.order.executionPrice}`);
    console.log('✓ Total Amount:', `$${buyData.order.totalAmount}`);
    console.log('✓ Updated Cash Balance:', `$${buyData.updatedCashBalance}`);
    console.log('✓ Holding Created: Quantity =', buyData.holding.quantity, 'Avg Buy Price =', buyData.holding.averageBuyPrice, '\n');

    // 6. Execute SELL Order (4 shares NVDA)
    console.log('6. Executing SELL Order (4 shares of NVDA) ...');
    const sellRes = await axios.post(
      `${BASE_URL}/orders/sell`,
      { symbol: 'NVDA', quantity: 4 },
      { headers: authHeaders }
    );
    const sellData = sellRes.data.data;
    console.log('✓ Sell Order Executed:', sellData.order._id);
    console.log('✓ Shares Sold:', sellData.order.quantity);
    console.log('✓ Remaining Shares in Holding:', sellData.holding.quantity);
    console.log('✓ Realized P&L on this trade:', `$${sellData.realizedPnL}`);
    console.log('✓ Cash Credited. New Balance:', `$${sellData.updatedCashBalance}\n`);

    // 7. Verify Watchlist Flow
    console.log('7. Testing Watchlist Add and Remove ...');
    await axios.post(`${BASE_URL}/watchlist`, { symbol: 'AAPL' }, { headers: authHeaders });
    const wlRes = await axios.get(`${BASE_URL}/watchlist`, { headers: authHeaders });
    console.log('✓ Watchlist contains:', wlRes.data.data.map(i => i.symbol).join(', '));
    await axios.delete(`${BASE_URL}/watchlist/AAPL`, { headers: authHeaders });
    const wlAfter = await axios.get(`${BASE_URL}/watchlist`, { headers: authHeaders });
    console.log('✓ Watchlist after removal count:', wlAfter.data.data.length, '\n');

    // 8. Verify Orders & Transaction Ledger
    console.log('8. Verifying Ledger Audit Trail ...');
    const ordersList = await axios.get(`${BASE_URL}/orders`, { headers: authHeaders });
    const txList = await axios.get(`${BASE_URL}/transactions`, { headers: authHeaders });
    console.log(`✓ Total Logged Orders: ${ordersList.data.data.orders.length}`);
    console.log(`✓ Total Logged Transactions: ${txList.data.data.transactions.length}\n`);

    // 9. Admin Platform Telemetry
    console.log('9. Testing Admin Telemetry & User Registry ...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@papertrade.com',
      password: 'AdminPassword123!',
    });
    const adminHeaders = { Authorization: `Bearer ${adminLogin.data.data.token}` };
    const adminStats = await axios.get(`${BASE_URL}/admin/stats`, { headers: adminHeaders });
    console.log('✓ Platform Total Users:', adminStats.data.data.totalUsers);
    console.log('✓ Platform Total Orders:', adminStats.data.data.totalOrders);
    console.log('✓ Platform Simulated Volume:', `$${adminStats.data.data.totalVolume}`);
    console.log('✓ Most Traded Stocks:', adminStats.data.data.topTradedStocks.map(s => `${s.symbol} (${s.tradeCount} trades)`).join(', '), '\n');

    console.log('===========================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('===========================================================');
  } catch (error) {
    console.error('❌ TEST FAILED:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
