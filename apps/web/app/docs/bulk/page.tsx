'use client';

import { ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Endpoint } from '@/components/docs/Endpoint';

export default function BulkProcessingPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Docs</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>API Reference</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-200">Bulk Processing</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-100">Bulk Processing</h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                    Efficiently generate thousands of PDFs in a single request using our atomic batching engine.
                </p>
            </div>

            <section className="space-y-4">
                <Endpoint method="POST" path="https://api.renderflux.io/bulk" />
                <p className="text-slate-400">
                    Accepts an array of render jobs and returns a Batch ID for tracking.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Request Body</h2>
                <p className="text-slate-400">
                    The payload should be a JSON array where each item matches the standard <code className="text-cyan-400">/render</code> payload.
                </p>
                <CodeBlock
                    code={`[
  {
    "html": "<h1>Invoice 1</h1>",
    "options": { "format": "A4" }
  },
  {
    "html": "<h1>Invoice 2</h1>",
    "options": { "format": "Letter" }
  }
]`}
                    language="json"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Response</h2>
                <p className="text-slate-400">
                    The API returns a <code className="text-purple-400">batchId</code> immediately. You can use this ID to poll for status or download the results as a ZIP file.
                </p>
                <CodeBlock
                    code={`{
  "batchId": "batch_123abc...",
  "count": 2,
  "status": "processing"
}`}
                    language="json"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Tracking Progress</h2>
                <p className="text-slate-400">
                    Poll the batch status endpoint to check progress.
                </p>
                <Endpoint method="GET" path="https://api.renderflux.io/batches/:batchId" />
                <CodeBlock
                    code={`{
  "id": "batch_123abc...",
  "total": 100,
  "completed": 45,
  "failed": 0,
  "status": "processing"
}`}
                    language="json"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Download Results</h2>
                <p className="text-slate-400">
                    Once completed, download all PDFs as a single ZIP archive.
                </p>
                <Endpoint method="GET" path="https://api.renderflux.io/batches/:batchId/zip" />
            </section>
        </div>
    );
}
