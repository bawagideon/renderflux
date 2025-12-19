'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/lib/supabase';

// Helper to download blobs
const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export function Playground() {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState(''); // Allow URL input
    const [html, setHtml] = useState('<h1>Hello RenderFlux!</h1>\n<p>Edit me to see changes...</p>');

    // New "Pro" Features
    const [mode, setMode] = useState<'pdf' | 'screenshot'>('pdf');
    const [format, setFormat] = useState('A4');
    const [landscape, setLandscape] = useState(false);
    const [scale, setScale] = useState(1); // For screenshots

    const handleRender = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/render`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // If URL is present, send it. Otherwise send HTML.
                    ...(url ? { url } : { html }),
                    type: mode, // 'pdf' or 'screenshot'
                    options: {
                        format: mode === 'pdf' ? format : undefined,
                        landscape,
                        scale: mode === 'screenshot' ? Number(scale) : undefined
                    },
                    userId: user?.id,
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Rendering failed');
            }

            // Handle the polling (The API returns { jobId, status: 'queued' })
            const initialData = await res.json();

            // Poll for result
            const result = await pollJob(initialData.jobId);

            if (result) {
                // Since our API currently returns a JSON with { result: 'base64...' } or direct buffer
                // Let's assume for this "Perfect" version we adjust the worker to return the file URL or Base64
                // For now, let's assume the worker returns a helper to download. 
                // NOTE: In the previous step, we set up the queue. 
                // If your /jobs/:id endpoint returns a "result" string (S3 URL or Base64), we handle it here.

                // Simpler for MVP: Just alert success or handle the specific return type you implemented.
                alert('Render Successful! Check your "Logs" page or implement direct download here.');
                console.log('Result:', result);
            }

        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const pollJob = async (jobId: string) => {
        const maxRetries = 20; // 40 seconds
        for (let i = 0; i < maxRetries; i++) {
            await new Promise(r => setTimeout(r, 2000));
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`);
            const data = await res.json();
            if (data.state === 'completed') return data.result;
            if (data.state === 'failed') throw new Error('Job failed in worker');
        }
        throw new Error('Timeout waiting for job');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-100">Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Mode Selector */}
                    <div className="space-y-2">
                        <Label className="text-slate-400">Mode</Label>
                        <div className="flex bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setMode('pdf')}
                                className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${mode === 'pdf' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                PDF
                            </button>
                            <button
                                onClick={() => setMode('screenshot')}
                                className={`flex-1 py-1 text-sm font-medium rounded-md transition-all ${mode === 'screenshot' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                Screenshot
                            </button>
                        </div>
                    </div>

                    {/* PDF Specific Options */}
                    {mode === 'pdf' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400">Format</Label>
                                <select
                                    className="w-full bg-slate-800 border-slate-700 rounded-md text-slate-200 text-sm p-2"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    <option value="A4">A4</option>
                                    <option value="Letter">Letter</option>
                                    <option value="Tabloid">Tabloid</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400">Orientation</Label>
                                <button
                                    onClick={() => setLandscape(!landscape)}
                                    className={`w-full py-2 text-sm border border-slate-700 rounded-md ${landscape ? 'bg-indigo-900/50 text-indigo-400 border-indigo-500' : 'bg-slate-800 text-slate-400'
                                        }`}
                                >
                                    {landscape ? 'Landscape' : 'Portrait'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Screenshot Specific Options */}
                    {mode === 'screenshot' && (
                        <div className="space-y-2">
                            <Label className="text-slate-400">Quality / Scale</Label>
                            <input
                                type="range" min="1" max="3" step="1"
                                value={scale}
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>1x (720p)</span>
                                <span>3x (4K)</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-800">
                        <Button onClick={handleRender} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                            {loading ? 'Processing...' : `Generate ${mode === 'pdf' ? 'PDF' : 'Image'}`}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Editor / Preview */}
            <Card className="lg:col-span-2 bg-slate-900 border-slate-800 min-h-[500px]">
                <CardHeader>
                    <CardTitle className="text-slate-100">HTML Input</CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea
                        className="w-full h-[400px] bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-md border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        placeholder="<html>...</html>"
                    />
                </CardContent>
            </Card>
        </div>
    );
}