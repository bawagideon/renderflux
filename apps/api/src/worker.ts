// apps/api/src/worker.ts
import { Worker, Job } from 'bullmq';
import { connection } from './queue'; // Or './redis' depending on your file structure
import { getBrowser } from './browser';
import { uploadToR2 } from './storage';
import { supabase } from './db';

// Define the interface for job data
interface JobData {
    html?: string;
    url?: string;
    type: 'pdf' | 'screenshot';
    options?: any;
    userId?: string;
    batchId?: string; // For bulk ops
}

export const startWorker = () => {
    console.log('👷 Worker Initialized');

    const worker = new Worker<JobData>('pdf-generation', async (job: Job) => {
        console.log(`[Job ${job.id}] Processing ${job.data.type}...`);

        let browser;
        let context;
        let page;

        try {
            // 1. Launch Browser
            browser = await getBrowser();
            context = await browser.newContext();
            page = await context.newPage();

            // 2. Load Content (HTML or URL)
            if (job.data.url) {
                await page.goto(job.data.url, { waitUntil: 'networkidle' });
            } else if (job.data.html) {
                await page.setContent(job.data.html, { waitUntil: 'networkidle' });
            }

            // 3. Generate Output (The Logic Split)
            let buffer: Buffer;
            let mimeType: string;
            let extension: string;

            if (job.data.type === 'screenshot') {
                // --- SCREENSHOT LOGIC ---
                buffer = await page.screenshot({
                    fullPage: true,
                    type: 'png',
                    // Apply scale if provided (defaults to 1)
                    scale: job.data.options?.scale ? 'css' : undefined
                });
                mimeType = 'image/png';
                extension = 'png';
            } else {
                // --- PDF LOGIC (Default) ---
                buffer = await page.pdf({
                    format: job.data.options?.format || 'A4',
                    printBackground: true,
                    landscape: job.data.options?.landscape || false,
                    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
                });
                mimeType = 'application/pdf';
                extension = 'pdf';
            }

            // 4. Upload to Storage (R2/S3)
            const filename = `${job.id}-${Date.now()}.${extension}`;
            const publicUrl = await uploadToR2(buffer, filename, mimeType);

            console.log(`[Job ${job.id}] Success: ${publicUrl}`);

            // 5. Update Usage Log (Async, don't await blocking)
            if (job.data.userId) {
                // Find the latest 'queued' log for this user and update it to 'success'
                // Or just insert a success log if tracking strictly by completion
                const { error } = await supabase
                    .from('usage_logs')
                    .update({ status: 'success', duration_ms: Date.now() - job.timestamp })
                    .eq('user_id', job.data.userId)
                    .eq('status', 'queued')
                    .order('created_at', { ascending: false })
                    .limit(1); // Update the most recent one
            }

            return { url: publicUrl };

        } catch (error: any) {
            console.error(`[Job ${job.id}] Failed:`, error);
            throw error; // Triggers BullMQ retry
        } finally {
            if (page) await page.close();
            if (context) await context.close();
            // Don't close browser, we reuse it (Monolith optimization)
        }

    }, {
        connection,
        concurrency: 5 // Process 5 jobs at once 
    });

    worker.on('completed', (job) => {
        console.log(`[Job ${job.id}] Completed!`);
    });

    worker.on('failed', (job, err) => {
        console.log(`[Job ${job?.id}] Failed with ${err.message}`);
    });
};