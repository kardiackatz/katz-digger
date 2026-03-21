/**
 * Local dev server — mirrors Vercel's /api function routing.
 * Run with: node server.dev.js  (or: npm run dev:server)
 * Vite proxies /api/* to this server (see vite.config.js).
 */
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json({ limit: '20mb' }));

// Route table: method → path → handler
const GET_HANDLERS = {
  '/api/search': require('./api/search'),
  '/api/release': require('./api/release'),
};
const POST_HANDLERS = {
  '/api/analyze': require('./api/analyze'),
  '/api/identify': require('./api/identify'),
  '/api/collect': require('./api/collect'),
};

app.all('/api/*', (req, res) => {
  const table = req.method === 'GET' ? GET_HANDLERS : POST_HANDLERS;
  const handler = table[req.path];
  if (!handler) {
    return res.status(404).json({ error: `No handler: ${req.method} ${req.path}` });
  }
  return handler(req, res);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`KatzDigger API  →  http://localhost:${PORT}`);
  console.log('Expecting Vite  →  http://localhost:5173');
});
