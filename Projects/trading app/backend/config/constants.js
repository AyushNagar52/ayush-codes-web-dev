module.exports = {
  PORT: process.env.PORT || 5000,
  INITIAL_CAPITAL: 100000.00, // $100,000 USD virtual capital
  JWT_SECRET: process.env.JWT_SECRET || 'paper_trading_jwt_secret_dev_key_2026_super_secure',
  JWT_EXPIRES_IN: '7d',
  FINNHUB_API_KEY: process.env.FINNHUB_API_KEY || 'sandbox_c8...', // Optional key, system falls back to simulation engine gracefully
  CACHE_TTLS: {
    QUOTE: 15,          // 15 seconds for live quote
    SEARCH: 86400,      // 24 hours for ticker search
    PROFILE: 604800,    // 7 days for company profile
    CANDLES_INTRADAY: 300,  // 5 minutes for 5m intraday candles
    CANDLES_DAILY: 86400    // 24 hours for daily candles
  }
};
