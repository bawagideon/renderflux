import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { pdfQueue, connection } from './queue';
import crypto from 'crypto';
import archiver from 'archiver';
import axios from 'axios';
import { supabase } from './db'; // Ensure this exists

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased for bulk payloads

// --- STANDARD RENDER ---
app.post('/render', async (req: Request, res: Response) => {
    try {
        const { html, templateId, data } = req.body;

        if (!html && !templateId) {
            return res.status(400).json({ error: 'Missing html or templateId' });
        }

        const job = await pdfQueue.add('render-pdf', {
            html,
            templateId,
            data,
        });

        res.json({ jobId: job.id, status: 'queued' });
    } catch (error) {
        console.error('Error queuing job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- TEMPLATES (Supabase) ---
app.post('/templates', async (req: Request, res: Response) => {
    try {
        const { html, name } = req.body;

        if (!html) {
            return res.status(400).json({ error: 'Missing html content' });
        }

        const { data, error } = await supabase
            .from('templates')
            .insert([{ html, name }])
            .select()
            .single();

        if (error) throw error;

        console.log(`Stored template ${data.id}`);
        res.json({ id: data.id, name: data.name, message: 'Template stored successfully' });
    } catch (error) {
        console.error('Error storing template:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/templates/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase
            .from('templates')
            .select('html')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Template not found' });
        }
        res.json({ id, html: data.html });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- JOB STATUS ---
app.get('/jobs/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const job = await pdfQueue.getJob(id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const state = await job.getState();
        const result = job.returnvalue;

        res.json({ id, state, result });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// --- BULK PROCESSING (Redis) ---
app.post('/bulk', async (req: Request, res: Response) => {
    try {
        // SAFETY CHECK 1: Ensure Redis is connected
        if (!connection) {
            return res.status(500).json({ error: 'Redis connection not available for bulk operations' });
        }

        const { data } = req.body;
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Invalid data array' });
        }

        const batchId = crypto.randomUUID();
        const jobs = data.map((item) => ({
            name: 'render-pdf',
            data: { ...item, batchId },
        }));

        // Now safe to use connection because of the check above
        await connection.set(`batch:${batchId}:total`, data.length);
        await connection.set(`batch:${batchId}:completed`, 0);
        await connection.del(`batch:${batchId}:urls`);

        await pdfQueue.addBulk(jobs);

        res.json({ batchId, count: data.length });
    } catch (error) {
        console.error('Error queuing bulk jobs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/batches/:batchId', async (req: Request, res: Response) => {
    const { batchId } = req.params;
    try {
        // SAFETY CHECK 2
        if (!connection) {
            return res.status(500).json({ error: 'Redis connection not available' });
        }

        const totalStr = await connection.get(`batch:${batchId}:total`);
        const completedStr = await connection.get(`batch:${batchId}:completed`);
        const urls = await connection.lrange(`batch:${batchId}:urls`, 0, -1);

        if (!totalStr) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        const total = parseInt(totalStr, 10);
        const completed = parseInt(completedStr || '0', 10);
        const percentage = total === 0 ? 0 : (completed / total) * 100;

        res.json({
            batchId,
            total,
            completed,
            percentage,
            status: percentage >= 100 ? 'completed' : 'processing',
            urls,
        });
    } catch (error) {
        console.error('Error fetching batch status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/batches/:batchId/zip', async (req: Request, res: Response) => {
    const { batchId } = req.params;
    try {
        // SAFETY CHECK 3
        if (!connection) {
            return res.status(500).json({ error: 'Redis connection not available' });
        }

        const totalStr = await connection.get(`batch:${batchId}:total`);
        const completedStr = await connection.get(`batch:${batchId}:completed`);

        if (!totalStr) {
            return res.status(404).json({ error: 'Batch not found' });
        }

        const total = parseInt(totalStr, 10);
        const completed = parseInt(completedStr || '0', 10);

        if (completed < total) {
            return res.status(400).json({ error: 'Batch not completed yet' });
        }

        const urls = await connection.lrange(`batch:${batchId}:urls`, 0, -1);

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="batch-${batchId}.zip"`);

        const archive = archiver('zip', {
            zlib: { level: 9 },
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(res);

        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                const response = await axios.get(url, { responseType: 'stream' });
                const filename = `document-${i + 1}.pdf`;
                archive.append(response.data, { name: filename });
            } catch (err) {
                console.error(`Failed to fetch ${url} for zip`, err);
                // Continue to next file even if one fails
            }
        }

        await archive.finalize();
    } catch (error) {
        console.error('Error generating zip:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});