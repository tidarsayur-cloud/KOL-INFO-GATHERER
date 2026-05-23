import { Router, Request, Response } from 'express';
import { pool, cacheGet, cacheSet } from '../db/connection';
import { searchCreators } from '../services/kalodata';
import { searchInfluencers } from '../services/kolid';

export const searchRoutes = Router();

// GET /api/v1/search?q=keyword&platform=tiktok&niche=food...
searchRoutes.get('/', async (req: Request, res: Response) => {
  try {
    const {
      q, platform, niche, hashtag, country,
      followerMin, followerMax,
      engagementMin, engagementMax,
      rateCardMin, rateCardMax,
      verifiedOnly, contentType,
      page = '1', limit = '20',
    } = req.query as Record<string, string>;

    if (!q && !niche && !hashtag && !country) {
      return res.status(400).json({ error: 'At least one search parameter required' });
    }

    const cacheKey = `search:${JSON.stringify(req.query)}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    // Search in local DB first (full-text search)
    const conditions: string[] = [];
    const params: unknown[] = [];
    let p = 1;

    if (q) {
      conditions.push(`(
        username ILIKE $${p} OR display_name ILIKE $${p} OR
        bio ILIKE $${p} OR niche ILIKE $${p++}
      )`);
      params.push(`%${q}%`);
    }
    if (platform) { conditions.push(`platform = $${p++}`); params.push(platform); }
    if (niche) { conditions.push(`niche ILIKE $${p++}`); params.push(`%${niche}%`); }
    if (country) { conditions.push(`country ILIKE $${p++}`); params.push(`%${country}%`); }
    if (followerMin) { conditions.push(`followers >= $${p++}`); params.push(Number(followerMin)); }
    if (followerMax) { conditions.push(`followers <= $${p++}`); params.push(Number(followerMax)); }
    if (engagementMin) { conditions.push(`engagement_rate >= $${p++}`); params.push(Number(engagementMin)); }
    if (engagementMax) { conditions.push(`engagement_rate <= $${p++}`); params.push(Number(engagementMax)); }
    if (rateCardMin) { conditions.push(`rate_card >= $${p++}`); params.push(Number(rateCardMin)); }
    if (rateCardMax) { conditions.push(`rate_card <= $${p++}`); params.push(Number(rateCardMax)); }
    if (verifiedOnly === 'true') conditions.push('is_verified = TRUE');

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);

    const sql = `
      SELECT *, COUNT(*) OVER() as total_count
      FROM creators ${where}
      ORDER BY engagement_rate DESC
      LIMIT $${p++} OFFSET $${p++}
    `;
    params.push(Number(limit), offset);

    const dbResult = await pool.query(sql, params);

    // Also try KaloData API if keyword provided and no/few DB results
    let apiResults: unknown[] = [];
    if (q && dbResult.rows.length < 5) {
      try {
        const apiData = await searchCreators(q);
        apiResults = apiData?.data?.creators || apiData?.creators || [];
      } catch (e) {
        console.warn('[Search] KaloData search failed:', e);
      }
    }

    const data = {
      results: [...dbResult.rows, ...apiResults],
      total: dbResult.rows[0]?.total_count || dbResult.rows.length,
      page: Number(page),
      limit: Number(limit),
      source: 'database',
    };

    await cacheSet(cacheKey, data, 600); // Cache 10 minutes
    res.json(data);
  } catch (err) {
    console.error('[Route] GET /search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/search/suggestions?q=keyword
searchRoutes.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const { q } = req.query as Record<string, string>;
    if (!q || q.length < 2) return res.json([]);

    const result = await pool.query(
      `SELECT creator_id, username, display_name, avatar_url, platform, followers, tier
       FROM creators
       WHERE username ILIKE $1 OR display_name ILIKE $1
       ORDER BY followers DESC LIMIT 8`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
