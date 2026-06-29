import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = globalForRedis.redis ?? new Redis(redisUrl, {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

export async function invalidateCache() {
  try {
    // Delete the dashboard aggregate key
    await redis.del('dashboard:overview');

    // Scan and delete all feed:page:* keys
    let cursor = '0';
    do {
      const [newCursor, keys] = await redis.scan(cursor, 'MATCH', 'feed:page:*', 'COUNT', 100);
      cursor = newCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch (error) {
    console.error('Failed to invalidate Redis cache:', error);
  }
}
