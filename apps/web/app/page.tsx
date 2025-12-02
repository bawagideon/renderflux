'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function Home() {
    const [html, setHtml] = useState('<h1>Hello RenderFlux</h1>\n<p>Edit me to see live updates!</p>');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
            const res = await fetch('http://localhost:3002/render', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ html }),
            });
            const data = await res.json();

            // For now, we might get a base64 string or a URL
            // If base64, we can display it using a data URI
            // If URL, we use that.
            // The worker currently returns { url: string, pdf: string (base64) }
            // Let's assume we get a job ID and need to poll, OR for the playground we want instant feedback.
            // The current API returns { jobId, status: 'queued' }.
            // We need to poll for the result or update the API to wait (not ideal for queue).
            // For the playground, let's just simulate the "instant" feel by polling.

            if (data.jobId) {
                console.log('Job queued:', data.jobId);

                // Poll for result
                const interval = setInterval(async () => {
                    try {
                        const jobRes = await fetch(`http://localhost:3002/jobs/${data.jobId}`);
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

    return (
        <main className="flex h-screen flex-col bg-gray-900 text-white">
            <header className="flex items-center justify-between border-b border-gray-800 p-4">
                <h1 className="text-xl font-bold text-blue-400">RenderFlux Playground</h1>
                <button
                    onClick={handleRender}
                    className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Rendering...' : 'Force Render'}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Editor Pane */}
                <div className="w-1/2 border-r border-gray-800">
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
                <div className="flex w-1/2 flex-col items-center justify-center bg-gray-800 p-4">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="h-full w-full rounded border border-gray-700 bg-white"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="text-gray-500">
                            {loading ? 'Generating Preview...' : 'Preview will appear here'}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
