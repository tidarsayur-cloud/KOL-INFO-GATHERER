import { Router, Request, Response } from 'express';
import { pool, cacheGet, cacheSet } from '../db/connection';

export const compareRoutes = Router();

// GET /api/v1/compare?ids=id1,id2,id3
compareRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const { ids } = req.query as Record<string, string>;
    if (!ids) return res.status(400).json({ error: 'ids parameter required (comma-separated)' });

    const idList = ids.split(',').slice(0, 4); // Max 4 influencers
    if (idList.length < 2) {
      return res.status(400).json({ error: 'At least 2 IDs required for comparison' });
    }

    const cacheKey = `compare:${idList.sort().join(',')}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const placeholders = idList.map((_, i) => `$${i + 1}`).join(',');
    const creatorsResult = await pool.query(
      `SELECT * FROM creators WHERE creator_id IN (${placeholders}) OR id::text IN (${placeholders})`,
      [...idList, ...idList]
    );

    // Get snapshots for trend comparison
    const snapshotResult = await pool.query(
      `SELECT creator_id, followers, engagement_rate, avg_views, snapshot_date
       FROM creator_snapshots
       WHERE creator_id IN (${idList.map((_, i) => `$${i + 1}`).join(',')})
       AND snapshot_date >= CURRENT_DATE - INTERVAL '90 days'
       ORDER BY snapshot_date ASC`,
      idList
    );

    // Get top content for each
    const contentResult = await pool.query(
      `SELECT creator_id, video_id, title, views, likes, comments, thumbnail_url, published_at
       FROM content
       WHERE creator_id IN (${idList.map((_, i) => `$${i + 1}`).join(',')})
       ORDER BY views DESC`,
      idList
    );

    const data = {
      influencers: creatorsResult.rows,
      snapshots: snapshotResult.rows,
      topContent: contentResult.rows,
      comparedAt: new Date().toISOString(),
    };

    await cacheSet(cacheKey, data, 3600);
    res.json(data);
  } catch (err) {
    console.error('[Route] GET /compare error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
