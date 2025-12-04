'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function Playground() {
    const [html, setHtml] = useState('<h1>Hello RenderFlux</h1>\n<p>Edit me to see live updates!</p>');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [batchId, setBatchId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [isBatchMode, setIsBatchMode] = useState(false);

    // Debounce render to avoid spamming API
    useEffect(() => {
        const timer = setTimeout(() => {
            handleRender();
        }, 1000);

        return () => clearTimeout(timer);
    }, [html]);

    const handleRender = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/render`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html }),
            });
            const data = await res.json();

            if (data.jobId) {
                console.log('Job queued:', data.jobId);

                // Poll for result
                const interval = setInterval(async () => {
                    try {
                        const jobRes = await fetch(`http://localhost:3001/jobs/${data.jobId}`);
                        const jobData = await jobRes.json();

                        if (jobData.state === 'completed' && jobData.result) {
                            clearInterval(interval);
                            setLoading(false);
                            // If result has URL, use it. If base64, construct data URI.
                            if (jobData.result.url) {
                                setPdfUrl(jobData.result.url);
                            } else if (jobData.result.pdf) {
                                setPdfUrl(`data:application/pdf;base64,${jobData.result.pdf}`);
                            }
                        } else if (jobData.state === 'failed') {
                            clearInterval(interval);
                            setLoading(false);
                            console.error('Job failed');
                        }
                    } catch (e) {
                        console.error('Polling error', e);
                    }
                }, 1000);
            } else {
                setLoading(false);
            }

        } catch (error) {
            console.error('Render failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const runBulkTest = async () => {
        setLoading(true);
        setBatchId(null);
        setProgress(0);
        setPdfUrl(null);

        const items = Array.from({ length: 50 }, (_, i) => ({
            html: html.replace('<h1>Hello RenderFlux</h1>', `<h1>Document ${i + 1}</h1>`),
        }));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: items }),
            });
            const data = await res.json();

            if (data.batchId) {
                setBatchId(data.batchId);
                const interval = setInterval(async () => {
                    try {
                        const batchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/batches/${data.batchId}`);
                        const batchData = await batchRes.json();

                        setProgress(batchData.percentage);

                        if (batchData.percentage === 100) {
                            clearInterval(interval);
                            setLoading(false);
                        }
                    } catch (e) {
                        console.error('Polling error', e);
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Bulk test failed:', error);
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-slate-950 text-slate-200">
            <header className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-900">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Mode:</span>
                        <Button
                            variant={!isBatchMode ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => setIsBatchMode(false)}
                        >
                            Single
                        </Button>
                        <Button
                            variant={isBatchMode ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => setIsBatchMode(true)}
                        >
                            Batch
                        </Button>
                    </div>
                    {isBatchMode ? (
                        <Button
                            onClick={runBulkTest}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-500 text-white"
                        >
                            {loading ? 'Processing...' : 'Run Bulk Test (50)'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleRender}
                            disabled={loading}
                        >
                            {loading ? 'Rendering...' : 'Force Render'}
                        </Button>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Editor Pane */}
                <div className="w-1/2 border-r border-slate-800">
                    <Editor
                        height="100%"
                        defaultLanguage="html"
                        theme="vs-dark"
                        value={html}
                        onChange={(value) => setHtml(value || '')}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 16 },
                        }}
                    />
                </div>

                {/* Preview Pane */}
                <div className="flex w-1/2 flex-col items-center justify-center bg-slate-900 p-4">
                    {isBatchMode ? (
                        <div className="w-full max-w-md text-center">
                            <h2 className="text-2xl font-bold mb-4 text-slate-100">Batch Processing</h2>
                            {batchId ? (
                                <div className="space-y-4">
                                    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-green-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="text-slate-300">{Math.round(progress)}% Complete</p>
                                    {progress === 100 && (
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_API_URL}/batches/${batchId}/zip`}
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-cyan-500 text-slate-950 hover:bg-cyan-400 h-10 px-4 py-2"
                                        >
                                            Download ZIP
                                        </a>
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-400">Click "Run Bulk Test" to start</p>
                            )}
                        </div>
                    ) : (
                        pdfUrl ? (
                            <iframe
                                src={pdfUrl}
                                className="h-full w-full rounded border border-slate-700 bg-white"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="text-slate-500">
                                {loading ? 'Generating Preview...' : 'Preview will appear here'}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
