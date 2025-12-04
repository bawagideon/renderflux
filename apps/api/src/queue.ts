import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const USE_MOCK_QUEUE = process.env.USE_MOCK_QUEUE === 'true';

let pdfQueue: any;
let connection: IORedis | undefined; // FIX: Declare it here so it's accessible

if (USE_MOCK_QUEUE) {
    console.log('⚠️ Using Mock Queue (File-based)');
    // Dynamic require to prevent TS errors if config isn't linked yet in some environments
    const { MockQueue } = require('config');
    pdfQueue = new MockQueue('pdf-generation');
} else {
    // FIX: Assign to the outer variable, don't use 'const' here
    connection = new IORedis(REDIS_URL, {
        maxRetriesPerRequest: null,
    });
    pdfQueue = new Queue('pdf-generation', { connection });
}

export { pdfQueue, connection };