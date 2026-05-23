/**
 * Daily Sync Cron Job
 * Runs every day at 02:00 WIB (UTC+7) = 19:00 UTC
 * Syncs creator data from KaloData and KOL.ID APIs
 */
import cron from 'node-cron';
import { getCreatorRanking, delay } from '../services/kalodata';
import { pool, redis } from '../db/connection';

const REGIONS = ['ID'];
const MAX_PAGES = 5;
const THROTTLE_MS = 500;

const upsertCreator = async (creator: Record<string, unknown>) => {
  const sql = `
    INSERT INTO creators (
      creator_id, source, username, display_name, platform,
      avatar_url, followers, engagement_rate, avg_views,
      avg_likes, avg_comments, niche, region, is_verified, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW())
    ON CONFLICT (creator_id) DO UPDATE SET
      username = EXCLUDED.username,
      display_name = EXCLUDED.display_name,
      avatar_url = EXCLUDED.avatar_url,
      followers = EXCLUDED.followers,
      engagement_rate = EXCLUDED.engagement_rate,
      avg_views = EXCLUDED.avg_views,
      avg_likes = EXCLUDED.avg_likes,
      avg_comments = EXCLUDED.avg_comments,
      niche = EXCLUDED.niche,
      is_verified = EXCLUDED.is_verified,
      updated_at = NOW()
  `;
  await pool.query(sql, [
    creator.creator_id,
    'kalodata',
    creator.username || creator.nickname,
    creator.display_name || creator.nickname,
    'tiktok',
    creator.avatar_url || creator.avatar,
    creator.follower_count || creator.followers || 0,
    creator.engagement_rate || 0,
    creator.avg_play_count || creator.avg_views || 0,
    creator.avg_like_count || creator.avg_likes || 0,
    creator.avg_comment_count || creator.avg_comments || 0,
    creator.category || creator.niche || null,
    creator.region || 'ID',
    creator.is_verified || false,
  ]);
};

const snapshotCreator = async (
  creatorId: string,
  followers: number,
  engagementRate: number,
  avgViews: number
) => {
  const sql = `
    INSERT INTO creator_snapshots (creator_id, followers, engagement_rate, avg_views, snapshot_date)
    VALUES ($1, $2, $3, $4, CURRENT_DATE)
    ON CONFLICT (creator_id, snapshot_date) DO UPDATE SET
      followers = EXCLUDED.followers,
      engagement_rate = EXCLUDED.engagement_rate,
      avg_views = EXCLUDED.avg_views
  `;
  await pool.query(sql, [creatorId, followers, engagementRate, avgViews]);
};

export const runDailySync = async () => {
  const syncStart = new Date();
  console.log(`[CRON] Daily sync started at ${syncStart.toISOString()}`);

  let totalRecords = 0;
  let totalErrors = 0;

  // Log sync start
  const logResult = await pool.query(
    `INSERT INTO sync_log (sync_type, status) VALUES ('daily_full', 'running') RETURNING id`
  );
  const syncLogId = logResult.rows[0]?.id;

  for (const region of REGIONS) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      try {
        const data = await getCreatorRanking({ region, page, sortField: 'engagement_rate' });
        const creators = data?.data?.creators || data?.creators || [];

        for (const creator of creators) {
          try {
            await upsertCreator({ ...creator, region });
            await snapshotCreator(
              creator.creator_id,
              creator.follower_count || creator.followers || 0,
              creator.engagement_rate || 0,
              creator.avg_play_count || creator.avg_views || 0
            );
            totalRecords++;
          } catch (err) {
            console.error(`[CRON] Error upserting creator ${creator.creator_id}:`, err);
            totalErrors++;
          }
        }

        await delay(THROTTLE_MS); // Respect API rate limits
      } catch (err) {
        console.error(`[CRON] Error fetching page ${page} for region ${region}:`, err);
        totalErrors++;
        await delay(2000);
      }
    }
  }

  // Update sync log
  await pool.query(
    `UPDATE sync_log SET status='completed', records=$1, errors=$2, finished_at=NOW() WHERE id=$3`,
    [totalRecords, totalErrors, syncLogId]
  );

  // Update Redis cache
  await redis.set('last_sync', new Date().toISOString());
  await redis.set('last_sync_records', totalRecords.toString());

  // Invalidate leaderboard cache
  const cacheKeys = await redis.keys('leaderboard:*');
  if (cacheKeys.length > 0) await redis.del(...cacheKeys);

  console.log(`[CRON] Daily sync complete. Records: ${totalRecords}, Errors: ${totalErrors}`);
};

export const startCronJobs = () => {
  // Daily sync at 02:00 WIB (19:00 UTC)
  cron.schedule('0 19 * * *', runDailySync, {
    scheduled: true,
    timezone: 'UTC',
  });

  console.log('[CRON] Daily sync job scheduled (02:00 WIB daily)');
};
