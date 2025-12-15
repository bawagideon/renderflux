// apps/api/src/redis.ts
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// FIX: Optimized config for Upstash/Production
export const connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false, // Required for serverless Redis
});
