import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { influencerRoutes } from './routes/influencers';
import { searchRoutes } from './routes/search';
import { compareRoutes } from './routes/compare';
import { embedRoutes } from './routes/embeds';
import { syncRoutes } from './routes/sync';
import { startCronJobs } from './jobs/dailySync';
import { pool } from './db/connection';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error' });
  }
});

// Routes
app.use('/api/v1/influencers', influencerRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/compare', compareRoutes);
app.use('/api/v1/embeds', embedRoutes);
app.use('/api/v1/sync', syncRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[API] Server running on port ${PORT}`);
  // Start daily sync cron job
  startCronJobs();
});

export default app;
