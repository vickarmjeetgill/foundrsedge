import { redis } from './redis';

/**
 * Evaluates rate limit using a rolling window increment in Redis.
 * Defaults to 20 requests per 60 seconds.
 */
export async function rateLimit(
    ip: string,
    limit: number = 20,
    windowSeconds: number = 60
): Promise<{ success: boolean; limit: number; remaining: number }> {
    const key = `rate_limit:${ip}`;

    try {
        const current = await redis.incr(key);

        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }

        const remaining = Math.max(limit - current, 0);

        if (current > limit) {
            return { success: false, limit, remaining };
        }

        return { success: true, limit, remaining };
    } catch (error) {
        console.error('Rate limit evaluation error:', error);
        // Graceful degradation: allow request if Redis fails
        return { success: true, limit, remaining: limit };
    }
}