import { Router, Request, Response } from 'express';
import { pool, cacheGet, cacheSet } from '../db/connection';
import { getCreatorDetail } from '../services/kalodata';

export const influencerRoutes = Router();

// GET /api/v1/influencers - List with filters
influencerRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const {
      tier, platform, category, region = 'ID',
      sortBy = 'engagement_rate', order = 'DESC',
      page = '1', limit = '20',
      followerMin, followerMax,
      engagementMin, engagementMax,
      verifiedOnly,
    } = req.query as Record<string, string>;

    const cacheKey = `leaderboard:${JSON.stringify(req.query)}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const conditions: string[] = ['1=1'];
    const params: unknown[] = [];
    let p = 1;

    if (tier) { conditions.push(`tier = $${p++}`); params.push(tier); }
    if (platform) { conditions.push(`platform = $${p++}`); params.push(platform); }
    if (category) { conditions.push(`(niche ILIKE $${p} OR category ILIKE $${p++})`); params.push(`%${category}%`); }
    if (region) { conditions.push(`region = $${p++}`); params.push(region); }
    if (followerMin) { conditions.push(`followers >= $${p++}`); params.push(Number(followerMin)); }
    if (followerMax) { conditions.push(`followers <= $${p++}`); params.push(Number(followerMax)); }
    if (engagementMin) { conditions.push(`engagement_rate >= $${p++}`); params.push(Number(engagementMin)); }
    if (engagementMax) { conditions.push(`engagement_rate <= $${p++}`); params.push(Number(engagementMax)); }
    if (verifiedOnly === 'true') { conditions.push('is_verified = TRUE'); }

    const allowedSort = ['engagement_rate','followers','avg_views','avg_likes','updated_at'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'engagement_rate';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const offset = (Number(page) - 1) * Number(limit);

    const sql = `
      SELECT *, COUNT(*) OVER() AS total_count
      FROM creators
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT $${p++} OFFSET $${p++}
    `;
    params.push(Number(limit), offset);

    const result = await pool.query(sql, params);
    const data = {
      influencers: result.rows,
      total: result.rows[0]?.total_count || 0,
      page: Number(page),
      limit: Number(limit),
    };

    await cacheSet(cacheKey, data, 1800); // Cache 30 minutes
    res.json(data);
  } catch (err) {
    console.error('[Route] GET /influencers error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/influencers/stats - Dashboard summary stats
influencerRoutes.get('/stats', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'stats:dashboard';
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_influencers,
        ROUND(AVG(engagement_rate), 2) AS avg_engagement_rate,
        COUNT(DISTINCT platform) AS total_platforms,
        MAX(updated_at) AS last_updated,
        COUNT(CASE WHEN tier = 'nano' THEN 1 END) AS nano_count,
        COUNT(CASE WHEN tier = 'micro' THEN 1 END) AS micro_count,
        COUNT(CASE WHEN tier = 'mid-tier' THEN 1 END) AS mid_tier_count,
        COUNT(CASE WHEN tier = 'macro' THEN 1 END) AS macro_count
      FROM creators
    `);

    const lastSync = await pool.query(
      `SELECT started_at, records FROM sync_log WHERE status='completed' ORDER BY started_at DESC LIMIT 1`
    );

    const data = { ...result.rows[0], last_sync: lastSync.rows[0] || null };
    await cacheSet(cacheKey, data, 300);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/influencers/:id - Influencer profile
influencerRoutes.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cacheKey = `influencer:${id}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    // Try DB first
    const dbResult = await pool.query(
      'SELECT c.*, ad.* FROM creators c LEFT JOIN audience_demographics ad ON c.creator_id = ad.creator_id WHERE c.creator_id = $1 OR c.id::text = $1',
      [id]
    );

    let profile = dbResult.rows[0];

    // If not in DB, fetch from KaloData
    if (!profile) {
      const apiData = await getCreatorDetail(id);
      profile = apiData?.data || apiData;
    }

    if (!profile) return res.status(404).json({ error: 'Influencer not found' });

    await cacheSet(cacheKey, profile, 3600);
    res.json(profile);
  } catch (err) {
    console.error('[Route] GET /influencers/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/influencers/:id/snapshots - Historical trend data
influencerRoutes.get('/:id/snapshots', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = '90' } = req.query as Record<string, string>;

    const result = await pool.query(
      `SELECT * FROM creator_snapshots
       WHERE creator_id = $1 AND snapshot_date >= CURRENT_DATE - INTERVAL '${Number(days)} days'
       ORDER BY snapshot_date ASC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
