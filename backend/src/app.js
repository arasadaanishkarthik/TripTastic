const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security & Parsing Middleware
app.use(helmet());
const configuredClientOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5175';
const allowedOrigins = new Set([
  configuredClientOrigin,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  // Add any additional production URLs via environment variable
  ...(process.env.ADDITIONAL_ORIGINS ? process.env.ADDITIONAL_ORIGINS.split(',').map(o => o.trim()) : []),
]);
app.use(cors({
  origin(origin, callback) {
    // Non-browser requests (health checks, curl, server-side clients) have no
    // Origin header and should remain usable during local development.
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
}));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', routes);

// Unknown Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Centralized Error Handling
app.use(errorHandler);

module.exports = app;