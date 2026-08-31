// backend/src/server.js
// Entry point — verifies MySQL connection, then starts Express

const path = require('path');

// Always load the backend environment, regardless of the directory used to
// launch node (for example, `node triptastic/backend/src/server.js`).
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app  = require('./app');
const pool = require('./config/db');
const ai   = require('./services/aiClient');

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  // ── AI Provider Diagnostics (Groq / Gemini) ───────────────────────────────
  ai.logDiagnostics();

  // ── MySQL Connectivity Check ─────────────────────────────────────────────
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅  MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message);
    console.error(
      '\n👉  Please check your backend/.env and ensure MySQL is running.\n' +
      '    Expected configuration:\n' +
      `    DB_HOST=${process.env.DB_HOST || 'localhost'}\n` +
      `    DB_PORT=${process.env.DB_PORT || '3306'}\n` +
      `    DB_USER=${process.env.DB_USER || 'root'}\n` +
      `    DB_NAME=${process.env.DB_NAME || 'triptastic'}\n`
    );
    // Allow server to start even without DB so routes can return 503
    // rather than crashing immediately on DB-connection failure.
  }

  // ── Start Express ────────────────────────────────────────────────────────
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