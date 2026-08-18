const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply general rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Paper Trading API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
