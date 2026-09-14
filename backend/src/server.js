// backend/src/server.js
// Entry point — starts Express without any database dependency.

const path = require('path');

// Load backend environment variables.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const ai  = require('./services/aiClient');

const PORT     = parseInt(process.env.PORT || '5000', 10);
const HOST     = process.env.HOST     || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  // Google Gemini AI diagnostics
  ai.logDiagnostics();

  // Start Express — no database connection required
  app.listen(PORT, HOST, () => {
    const url = NODE_ENV === 'production'
      ? `http://0.0.0.0:${PORT}`
      : `http://localhost:${PORT}`;
    console.log(`🚀  TripTastic Backend running on ${url}`);
    console.log(`📡  Health check: ${url}/api/health`);
    console.log(`🔧  Environment: ${NODE_ENV}`);
  });
};

startServer();
