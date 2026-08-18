const axios = require('axios');
const NodeCache = require('node-cache');
const { FINNHUB_API_KEY, CACHE_TTLS } = require('../config/constants');
const AppError = require('../utils/customError');

// Initialize in-memory cache
const marketCache = new NodeCache({ checkperiod: 60 });

// Curated stock seed data for search, overview, and fallback simulation
const KNOWN_STOCKS = {
  AAPL: { name: 'Apple Inc.', sector: 'Technology', basePrice: 228.50, marketCap: '3.48T', peRatio: 34.2, high52: 237.23, low52: 164.08 },
  NVDA: { name: 'NVIDIA Corporation', sector: 'Technology', basePrice: 124.80, marketCap: '3.08T', peRatio: 48.6, high52: 140.76, low52: 45.11 },
  MSFT: { name: 'Microsoft Corporation', sector: 'Technology', basePrice: 421.10, marketCap: '3.13T', peRatio: 35.8, high52: 468.35, low52: 309.45 },
  AMZN: { name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', basePrice: 186.40, marketCap: '1.94T', peRatio: 43.1, high52: 201.20, low52: 118.35 },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Communication Services', basePrice: 165.20, marketCap: '2.05T', peRatio: 24.5, high52: 191.75, low52: 120.21 },
  META: { name: 'Meta Platforms Inc.', sector: 'Communication Services', basePrice: 532.75, marketCap: '1.35T', peRatio: 27.3, high52: 544.23, low52: 279.40 },
  TSLA: { name: 'Tesla Inc.', sector: 'Consumer Cyclical', basePrice: 214.30, marketCap: '685.2B', peRatio: 62.4, high52: 271.00, low52: 138.80 },
  AMD: { name: 'Advanced Micro Devices Inc.', sector: 'Technology', basePrice: 152.60, marketCap: '246.8B', peRatio: 112.5, high52: 227.30, low52: 94.04 },
  NFLX: { name: 'Netflix Inc.', sector: 'Communication Services', basePrice: 678.90, marketCap: '292.1B', peRatio: 42.8, high52: 700.99, low52: 344.73 },
  SPY: { name: 'SPDR S&P 500 ETF Trust', sector: 'Index ETF', basePrice: 558.40, marketCap: '560.0B', peRatio: 26.1, high52: 565.16, low52: 410.07 },
  QQQ: { name: 'Invesco QQQ Trust', sector: 'Index ETF', basePrice: 483.20, marketCap: '275.0B', peRatio: 30.5, high52: 503.52, low52: 342.35 },
  COIN: { name: 'Coinbase Global Inc.', sector: 'Financial Services', basePrice: 205.10, marketCap: '50.4B', peRatio: 41.2, high52: 283.48, low52: 69.63 },
};

/**
 * Generates synthetic simulated quote for a stock with realistic micro-variations
 */
const generateSyntheticQuote = (symbol) => {
  const stock = KNOWN_STOCKS[symbol] || {
    name: `${symbol} Corporation`,
    sector: 'Equities',
    basePrice: 100.00,
    marketCap: '10.0B',
    peRatio: 20.0,
    high52: 120.00,
    low52: 80.00,
  };

  // Pseudo-random deterministic variation based on current time minute
  const now = new Date();
  const timeSeed = (now.getHours() * 60 + now.getMinutes()) + (now.getSeconds() / 60);
  const variationPercent = Math.sin(timeSeed + symbol.charCodeAt(0)) * 0.025; // +/- 2.5% max
  const currentPrice = Number((stock.basePrice * (1 + variationPercent)).toFixed(2));
  const previousClose = stock.basePrice;
  const change = Number((currentPrice - previousClose).toFixed(2));
  const changePercent = Number(((change / previousClose) * 100).toFixed(2));
  const high = Number((Math.max(currentPrice, previousClose) * 1.012).toFixed(2));
  const low = Number((Math.min(currentPrice, previousClose) * 0.988).toFixed(2));
  const open = Number((previousClose * 1.002).toFixed(2));

  return {
    symbol,
    companyName: stock.name,
    c: currentPrice,           // Current price
    d: change,                 // Change
    dp: changePercent,         // Percent change
    h: high,                   // High price of the day
    l: low,                    // Low price of the day
    o: open,                   // Open price of the day
    pc: previousClose,         // Previous close price
    t: Math.floor(Date.now() / 1000),
    isSimulated: true,
  };
};

/**
 * Get real-time or cached stock quote
 */
const getStockQuote = async (symbol) => {
  const cleanSymbol = symbol.toUpperCase().trim();
  const cacheKey = `quote_${cleanSymbol}`;

  const cachedQuote = marketCache.get(cacheKey);
  if (cachedQuote) {
    return cachedQuote;
  }

  // Try fetching from Finnhub API if valid key is set
  if (FINNHUB_API_KEY && !FINNHUB_API_KEY.startsWith('sandbox_')) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: { symbol: cleanSymbol, token: FINNHUB_API_KEY },
        timeout: 4000,
      });

      if (response.data && response.data.c > 0) {
        const quoteData = {
          symbol: cleanSymbol,
          companyName: KNOWN_STOCKS[cleanSymbol]?.name || `${cleanSymbol} Corp`,
          c: Number(response.data.c.toFixed(2)),
          d: Number(response.data.d.toFixed(2)),
          dp: Number(response.data.dp.toFixed(2)),
          h: Number(response.data.h.toFixed(2)),
          l: Number(response.data.l.toFixed(2)),
          o: Number(response.data.o.toFixed(2)),
          pc: Number(response.data.pc.toFixed(2)),
          t: response.data.t || Math.floor(Date.now() / 1000),
          isSimulated: false,
        };

        marketCache.set(cacheKey, quoteData, CACHE_TTLS.QUOTE);
        return quoteData;
      }
    } catch (apiError) {
      console.warn(`[Market API Notice] Finnhub live quote failed for ${cleanSymbol}, using fallback engine:`, apiError.message);
    }
  }

  // Fallback to high-fidelity simulated quote engine
  const fallbackQuote = generateSyntheticQuote(cleanSymbol);
  marketCache.set(cacheKey, fallbackQuote, CACHE_TTLS.QUOTE);
  return fallbackQuote;
};

/**
 * Search stocks by symbol or company name
 */
const searchStocks = async (query) => {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toUpperCase();
  const cacheKey = `search_${q}`;

  const cachedResults = marketCache.get(cacheKey);
  if (cachedResults) return cachedResults;

  // Search in known stock directory first
  const localMatches = Object.entries(KNOWN_STOCKS)
    .filter(([sym, data]) => sym.includes(q) || data.name.toUpperCase().includes(q))
    .map(([sym, data]) => ({
      symbol: sym,
      description: data.name,
      displaySymbol: sym,
      type: 'Common Stock',
    }));

  if (localMatches.length > 0) {
    marketCache.set(cacheKey, localMatches, CACHE_TTLS.SEARCH);
    return localMatches;
  }

  // Query Finnhub symbol lookup if available
  if (FINNHUB_API_KEY && !FINNHUB_API_KEY.startsWith('sandbox_')) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/search`, {
        params: { q, token: FINNHUB_API_KEY },
        timeout: 4000,
      });

      if (response.data && response.data.result) {
        const results = response.data.result.slice(0, 10).map((item) => ({
          symbol: item.symbol,
          description: item.description,
          displaySymbol: item.displaySymbol || item.symbol,
          type: item.type || 'Stock',
        }));
        marketCache.set(cacheKey, results, CACHE_TTLS.SEARCH);
        return results;
      }
    } catch (err) {
      console.warn('[Market Search] External search failed, returning default results');
    }
  }

  // Default fallback match
  const fallback = [{ symbol: q, description: `${q} Corporation`, displaySymbol: q, type: 'Common Stock' }];
  marketCache.set(cacheKey, fallback, CACHE_TTLS.SEARCH);
  return fallback;
};

/**
 * Get company profile and fundamentals
 */
const getCompanyProfile = async (symbol) => {
  const cleanSymbol = symbol.toUpperCase().trim();
  const cacheKey = `profile_${cleanSymbol}`;

  const cached = marketCache.get(cacheKey);
  if (cached) return cached;

  const stockMeta = KNOWN_STOCKS[cleanSymbol] || {
    name: `${cleanSymbol} Corporation`,
    sector: 'Technology',
    marketCap: '25.0B',
    peRatio: 22.4,
    high52: 150.00,
    low52: 95.00,
  };

  const profile = {
    symbol: cleanSymbol,
    name: stockMeta.name,
    industry: stockMeta.sector,
    marketCap: stockMeta.marketCap,
    peRatio: stockMeta.peRatio,
    high52: stockMeta.high52,
    low52: stockMeta.low52,
    description: `${stockMeta.name} is a publicly traded company on major US financial exchanges engaged in the ${stockMeta.sector} sector.`,
    currency: 'USD',
  };

  marketCache.set(cacheKey, profile, CACHE_TTLS.PROFILE);
  return profile;
};

/**
 * Get historical candlestick / line price data for charts
 */
const getStockHistory = async (symbol, range = '1M') => {
  const cleanSymbol = symbol.toUpperCase().trim();
  const cacheKey = `history_${cleanSymbol}_${range}`;

  const cached = marketCache.get(cacheKey);
  if (cached) return cached;

  const quote = await getStockQuote(cleanSymbol);
  const currentPrice = quote.c;

  // Generate historical data series
  const points = range === '1D' ? 24 : range === '1W' ? 35 : range === '1M' ? 30 : range === '1Y' ? 52 : 60;
  const history = [];
  const now = Date.now();
  const stepMs = range === '1D' ? 3600000 / 2 : range === '1W' ? 86400000 / 5 : 86400000;

  let walkingPrice = currentPrice * (range === '1D' ? 0.985 : range === '1W' ? 0.96 : range === '1M' ? 0.92 : 0.82);

  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now - i * stepMs);
    const noise = (Math.sin(i * 0.5) * 0.015) + ((Math.random() - 0.48) * 0.02);
    walkingPrice = Number((walkingPrice * (1 + noise)).toFixed(2));

    // Pull toward currentPrice on final point
    if (i === 0) walkingPrice = currentPrice;

    history.push({
      date: timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: range === '1D' ? '2-digit' : undefined }),
      time: timestamp.toISOString(),
      price: walkingPrice,
      open: Number((walkingPrice * 0.998).toFixed(2)),
      high: Number((walkingPrice * 1.01).toFixed(2)),
      low: Number((walkingPrice * 0.99).toFixed(2)),
      close: walkingPrice,
      volume: Math.floor(Math.random() * 5000000 + 1000000),
    });
  }

  marketCache.set(cacheKey, history, CACHE_TTLS.CANDLES_INTRADAY);
  return history;
};

/**
 * Get market overview (Top Gainers, Losers, Market Indices)
 */
const getMarketOverview = async () => {
  const cacheKey = 'market_overview_all';
  const cached = marketCache.get(cacheKey);
  if (cached) return cached;

  const symbols = Object.keys(KNOWN_STOCKS);
  const quotes = await Promise.all(symbols.map((sym) => getStockQuote(sym)));

  const sortedByGain = [...quotes].sort((a, b) => b.dp - a.dp);
  const gainers = sortedByGain.slice(0, 5);
  const losers = [...sortedByGain].reverse().slice(0, 5);

  const overview = {
    gainers,
    losers,
    indices: [
      quotes.find((q) => q.symbol === 'SPY') || quotes[0],
      quotes.find((q) => q.symbol === 'QQQ') || quotes[1],
    ],
    allStocks: quotes,
  };

  marketCache.set(cacheKey, overview, 30);
  return overview;
};

module.exports = {
  getStockQuote,
  searchStocks,
  getCompanyProfile,
  getStockHistory,
  getMarketOverview,
};
