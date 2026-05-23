import { Router, Request, Response } from 'express';
import { resolveEmbed, getTikTokEmbed, getYouTubeEmbedUrl, extractYouTubeVideoId } from '../services/embed';
import { pool, cacheGet, cacheSet } from '../db/connection';
import { getVideoRanking } from '../services/kalodata';

export const embedRoutes = Router();

// POST /api/v1/embeds/resolve - Resolve embed for any URL
embedRoutes.post('/resolve', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'url is required' });

    const cacheKey = `embed:${url}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const embedData = await resolveEmbed(url);
    await cacheSet(cacheKey, embedData, 86400); // Cache 24h
    res.json(embedData);
  } catch (err) {
    console.error('[Embeds] resolve error:', err);
    res.status(500).json({ error: 'Failed to resolve embed' });
  }
});

// GET /api/v1/embeds/creator/:creatorId - Get all videos for creator
embedRoutes.get('/creator/:creatorId', async (req: Request, res: Response) => {
  try {
    const { creatorId } = req.params;
    const { platform = 'tiktok', limit = '12' } = req.query as Record<string, string>;

    const cacheKey = `embeds:creator:${creatorId}:${platform}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    // Try DB first
    const dbResult = await pool.query(
      `SELECT * FROM content WHERE creator_id = $1 AND platform = $2 ORDER BY views DESC LIMIT $3`,
      [creatorId, platform, Number(limit)]
    );

    if (dbResult.rows.length > 0) {
      await cacheSet(cacheKey, dbResult.rows, 3600);
      return res.json(dbResult.rows);
    }

    // Fallback to KaloData API
    if (platform === 'tiktok') {
      const apiData = await getVideoRanking(creatorId);
      const videos = apiData?.data?.videos || apiData?.videos || [];
      await cacheSet(cacheKey, videos, 3600);
      return res.json(videos);
    }

    res.json([]);
  } catch (err) {
    console.error('[Embeds] creator error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/embeds/tiktok - Get TikTok oEmbed data
embedRoutes.get('/tiktok', async (req: Request, res: Response) => {
  try {
    const { url } = req.query as Record<string, string>;
    if (!url) return res.status(400).json({ error: 'url required' });

    const cacheKey = `tiktok_embed:${url}`;
    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const data = await getTikTokEmbed(url);
    await cacheSet(cacheKey, data, 86400);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch TikTok embed' });
  }
});

// GET /api/v1/embeds/youtube/:videoId - Get YouTube embed URL
embedRoutes.get('/youtube/:videoId', (req: Request, res: Response) => {
  const { videoId } = req.params;
  const { autoplay, mute } = req.query as Record<string, string>;
  const embedUrl = getYouTubeEmbedUrl(videoId, {
    autoplay: autoplay === 'true',
    mute: mute === 'true',
  });
  res.json({ embedUrl, platform: 'youtube', videoId });
});
