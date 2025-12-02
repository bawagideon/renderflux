import { Worker, Job } from 'bullmq';
import { connection } from './redis';
import { getBrowser } from './browser';
import Handlebars from 'handlebars';
import { MockWorker } from 'config';

const QUEUE_NAME = 'pdf-generation';
const USE_MOCK_QUEUE = process.env.USE_MOCK_QUEUE === 'true';

const processJob = async (job: any) => {
    console.log(`Processing job ${job.id}...`);
    const { html, templateId, data } = job.data;

    let content = html;
    if (templateId) {
        // Mock template fetching
    }

    if (data) {
        const template = Handlebars.compile(content);
        content = template(data);
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
        let url = '';
        try {
            const { uploadPdf } = await import('./storage');
            url = await uploadPdf(filename, Buffer.from(pdfBuffer));
        } catch (e) {
            console.error("Upload failed, returning base64 as fallback", e);
        }

        return {
            url,
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

    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed!`);
    });

    worker.on('failed', (job, err) => {
        console.error(`Job ${job?.id} failed with ${err.message}`);
    });

    console.log('Worker started!');
    return worker;
};
