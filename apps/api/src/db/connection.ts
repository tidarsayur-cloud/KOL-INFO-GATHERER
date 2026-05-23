import { Pool } from 'pg';
import Redis from 'ioredis';

// PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

// Redis client
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('[Redis] Connection error:', err.message);
});

redis.on('connect', () => {
  console.log('[Redis] Connected');
});

// Cache helpers
export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const val = await redis.get(key);
  return val ? JSON.parse(val) : null;
};

export const cacheSet = async (
  key: string,
  value: unknown,
  ttlSeconds = 3600
): Promise<void> => {
  await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

export const cacheDelete = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

// Typed DB query helper
export const query = async <T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};
