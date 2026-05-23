import { Router, Request, Response } from 'express';
import { runDailySync } from '../jobs/dailySync';
import { pool, redis } from '../db/connection';

export const syncRoutes = Router();

// GET /api/v1/sync/status - Current sync status
syncRoutes.get('/status', async (_req: Request, res: Response) => {
  try {
    const lastSync = await redis.get('last_sync');
    const lastRecords = await redis.get('last_sync_records');

    const syncLog = await pool.query(
      `SELECT * FROM sync_log ORDER BY started_at DESC LIMIT 5`
    );

    res.json({
      lastSync: lastSync || null,
      lastSyncRecords: lastRecords ? Number(lastRecords) : 0,
      recentSyncs: syncLog.rows,
      nextSync: 'Daily at 02:00 WIB',
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/v1/sync/trigger - Manually trigger a sync (admin)
syncRoutes.post('/trigger', async (req: Request, res: Response) => {
  try {
    const apiKey = req.headers['x-admin-key'];
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Run in background (non-blocking)
    runDailySync().catch(err => console.error('[ManualSync] Error:', err));

    res.json({
      message: 'Sync triggered successfully',
      startedAt: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
