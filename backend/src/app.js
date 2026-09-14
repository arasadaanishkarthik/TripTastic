const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security & Parsing Middleware
app.use(helmet());

// ── CORS Configuration ───────────────────────────────────────────────────────
// Allowed origins are built from environment variables so no rebuild is needed
// when the Vercel frontend URL changes.
//
// Render env vars to set:
//   FRONTEND_URL=https://triptastic.vercel.app      (your Vercel production URL)
//   ADDITIONAL_ORIGINS=https://other-preview.vercel.app  (comma-separated, optional)

const staticAllowed = new Set([
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
]);

// Pull in env-configured origins
(process.env.FRONTEND_URL || '').split(',').map(s => s.trim()).filter(Boolean).forEach(o => staticAllowed.add(o));
(process.env.CLIENT_URL   || '').split(',').map(s => s.trim()).filter(Boolean).forEach(o => staticAllowed.add(o));
(process.env.ADDITIONAL_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean).forEach(o => staticAllowed.add(o));

function isOriginAllowed(origin) {
  if (!origin) return true; // curl / server-side / health checks
  if (staticAllowed.has(origin)) return true;

  // Allow any *.vercel.app preview deployment automatically
  if (origin.endsWith('.vercel.app')) return true;

  // Allow any *.onrender.com origin (Render preview services)
  if (origin.endsWith('.onrender.com')) return true;

  return false;
}

app.use(cors({
  origin(origin, callback) {
    if (isOriginAllowed(origin)) return callback(null, true);
    console.warn(`[CORS] Rejected origin: ${origin}`);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
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