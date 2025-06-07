const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/responseFormatter');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many requests from this IP, please try again later.');
  }
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, 'Too many authentication attempts, please try again later.');
  }
});

module.exports = {
  generalLimiter,
  authLimiter
};