import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { MockQueue } from 'config';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const USE_MOCK_QUEUE = process.env.USE_MOCK_QUEUE === 'true';

let pdfQueue: any;

if (USE_MOCK_QUEUE) {
    console.log('⚠️ Using Mock Queue (File-based)');
    pdfQueue = new MockQueue('pdf-generation');
} else {
    const connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });
    pdfQueue = new Queue('pdf-generation', { connection });
}

export { pdfQueue };
