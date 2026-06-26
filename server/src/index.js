import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import booksRouter from './routes/books.js';
import { query } from './db.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Health check — useful for uptime monitoring and host readiness probes
app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable' });
  }
});

app.use('/api/books', booksRouter);

// Serve the static frontend from /public so one process serves both API and app.
app.use(express.static(join(__dirname, '..', '..', 'public')));

// 404 for unmatched /api routes
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Romansh API + app listening on http://localhost:${PORT}`);
});
