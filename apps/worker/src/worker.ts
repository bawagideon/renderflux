import { Worker, Job } from 'bullmq';
import { connection } from './redis';
import { getBrowser } from './browser';
import Handlebars from 'handlebars';
import { MockWorker } from 'config';
import { uploadPdf } from './storage';

const QUEUE_NAME = 'pdf-generation';
const USE_MOCK_QUEUE = process.env.USE_MOCK_QUEUE === 'true';

const processJob = async (job: any) => {
    console.log(`Processing job ${job.id}...`);
    const { html, templateId, data } = job.data;

    let content = html || '';

    // Simple template merging
    if (data && content) {
        try {
            const template = Handlebars.compile(content);
            content = template(data);
        } catch (e) {
            console.error("Template error:", e);
        }
    }

    if (!content) {
        throw new Error("No HTML content to render");
    }

    const browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.setContent(content, {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

        const filename = `pdf-${job.id}-${Date.now()}.pdf`;

        // Upload to R2
        const url = await uploadPdf(filename, Buffer.from(pdfBuffer));
        console.log(`Uploaded to: ${url}`);

        return {
            url,
            // Only return base64 if upload failed or wasn't configured, otherwise keep payload light
            pdf: url ? undefined : pdfBuffer.toString('base64')
        };
    } catch (error) {
        console.error(`Job ${job.id} failed:`, error);
        throw error;
    } finally {
        await page.close();
        await context.close();
    }
};

export const startWorker = () => {
    if (USE_MOCK_QUEUE) {
        console.log('⚠️ Starting Mock Worker (File-based)');
        return new MockWorker(QUEUE_NAME, processJob);
    }

    const worker = new Worker(
        QUEUE_NAME,
        processJob,
        {
            connection: connection as any,
            concurrency: 5,
            limiter: {
                max: 10,
                duration: 1000,
            },
        }
    );

    worker.on('completed', async (job) => {
        console.log(`Job ${job.id} completed!`);

        // --- BULK TRACKING LOGIC ---
        if (job.data?.batchId && connection) {
            try {
                const batchId = job.data.batchId;
                const resultUrl = job.returnvalue?.url;

                // 1. Increment completed count
                await connection.incr(`batch:${batchId}:completed`);

                // 2. Add URL to the list (if we have one)
                if (resultUrl) {
                    await connection.rpush(`batch:${batchId}:urls`, resultUrl);
                }
            } catch (err) {
                console.error("Failed to update batch stats", err);
            }
        }
    });

    worker.on('failed', (job, err) => {
        console.error(`Job ${job?.id} failed with ${err.message}`);
    });

    console.log('Worker started!');
    return worker;
};