const rateLimit = require('express-rate-limit');

// Auth rate limiter (15 minutes window, 20 requests per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (1 minute window, 120 requests per IP)
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: 'Too many requests, please slow down',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Order placement rate limiter (1 minute window, 30 orders per IP)
const orderLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Order rate limit exceeded. Please wait a moment before submitting more trades.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  apiLimiter,
  orderLimiter,
};
