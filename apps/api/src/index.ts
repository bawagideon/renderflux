import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { pdfQueue } from './queue';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple in-memory template storage (Replace with DB in production)
const templateStore = new Map<string, string>();

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

app.post('/templates', async (req: Request, res: Response) => {
    try {
        const { html, name } = req.body;

        if (!html) {
            return res.status(400).json({ error: 'Missing html content' });
        }

        const id = Math.random().toString(36).substring(7);
        templateStore.set(id, html);

        console.log(`Stored template ${id}`);
        res.json({ id, name, message: 'Template stored successfully' });
    } catch (error) {
        console.error('Error storing template:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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

app.get('/templates/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const html = templateStore.get(id);
    if (!html) {
        return res.status(404).json({ error: 'Template not found' });
    }
    res.json({ id, html });
});

app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
