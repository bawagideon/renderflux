import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const USE_MOCK_QUEUE = process.env.USE_MOCK_QUEUE === 'true';

export const redis = USE_MOCK_QUEUE ? null : new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required for BullMQ
});

export const connection = redis;
