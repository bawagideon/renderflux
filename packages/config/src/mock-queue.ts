import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

const QUEUE_DIR = path.join('C:\\Users\\HP\\.gemini\\antigravity\\scratch\\renderflux', '.queue');

// Ensure queue directory exists
if (!fs.existsSync(QUEUE_DIR)) {
    fs.mkdirSync(QUEUE_DIR, { recursive: true });
}

export class MockQueue extends EventEmitter {
    name: string;

    constructor(name: string, opts?: any) {
        super();
        this.name = name;
    }

    async add(name: string, data: any) {
        const id = Date.now().toString();
        const job = { id, name, data, status: 'queued', timestamp: Date.now() };
        const filePath = path.join(QUEUE_DIR, `${id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(job));
        return job;
    }

    process(handler: (job: any) => Promise<any>) {
        console.log(`[MockQueue] Processing started for ${this.name}`);

        // Poll for new files
        setInterval(async () => {
            try {
                const files = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('.json'));

                for (const file of files) {
                    const filePath = path.join(QUEUE_DIR, file);
                    const job = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                    if (job.status === 'queued') {
                        // Mark as processing
                        job.status = 'processing';
                        fs.writeFileSync(filePath, JSON.stringify(job));

                        try {
                            console.log(`[MockQueue] Processing job ${job.id}`);
                            const result = await handler({ id: job.id, data: job.data });

                            // Mark as completed
                            job.status = 'completed';
                            job.returnvalue = result;
                            fs.writeFileSync(filePath, JSON.stringify(job));
                            this.emit('completed', { id: job.id, returnvalue: result });
                        } catch (err: any) {
                            console.error(`[MockQueue] Job ${job.id} failed`, err);
                            job.status = 'failed';
                            job.failedReason = err.message;
                            fs.writeFileSync(filePath, JSON.stringify(job));
                            this.emit('failed', { id: job.id }, err);
                        }
                    }
                }
            } catch (e) {
                console.error('[MockQueue] Polling error:', e);
            }
        }, 1000); // Poll every second
    }

    on(event: string, listener: (...args: any[]) => void) {
        super.on(event, listener);
        return this;
    }
}

export class MockWorker extends MockQueue {
    constructor(name: string, handler: (job: any) => Promise<any>, opts?: any) {
        super(name);
        this.process(handler);
    }
}
