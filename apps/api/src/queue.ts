// apps/api/src/queue.ts
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const USE_MOCK_QUEUE = process.env.USE_MOCK_QUEUE === 'true';

let pdfQueue: any;
let connection: IORedis | undefined;

if (USE_MOCK_QUEUE) {
    console.log('⚠️ Using Mock Queue (File-based)');
    const { MockQueue } = require('config');
    pdfQueue = new MockQueue('pdf-generation');
} else {
    // FIX: Optimized config for Upstash/Production
    connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false, // Required for serverless Redis
    });
    pdfQueue = new Queue('pdf-generation', { connection });
}

export { pdfQueue, connection };