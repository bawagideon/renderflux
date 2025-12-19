'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/lib/supabase';

export function Playground() {
    const [loading, setLoading] = useState(false);
    const [html, setHtml] = useState('<h1>Hello RenderFlux!</h1>\n<p>Edit me to see changes...</p>');
    const [url, setUrl] = useState(''); // Optional URL input

    // Settings
    const [mode, setMode] = useState<'pdf' | 'screenshot'>('pdf');
    const [format, setFormat] = useState('A4');
    const [landscape, setLandscape] = useState(false);
    const [scale, setScale] = useState(1);

    // THE MISSING PIECE: State to hold the result URL
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const handleRender = async () => {
        setLoading(true);
        setResultUrl(null); // Clear previous result
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            // 1. Send Job to API
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/render`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    html: url ? undefined : html, // Send HTML if URL is empty
                    url: url || undefined,        // Send URL if provided
                    type: mode,
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

            const initialData = await res.json();

            // 2. Poll for Completion
            const finalUrl = await pollJob(initialData.jobId);

            // 3. SHOW THE RESULT
            setResultUrl(finalUrl);

        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const pollJob = async (jobId: string) => {
        const maxRetries = 30; // 60 seconds timeout
        for (let i = 0; i < maxRetries; i++) {
            await new Promise(r => setTimeout(r, 2000)); // Wait 2s

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`);
            const data = await res.json();

            console.log('Polling Job:', data); // Debugging log

            if (data.state === 'completed') {
                // The worker returns { url: '...' } in the result
                return data.result.url;
            }
            if (data.state === 'failed') throw new Error('Job failed in worker');
        }
        throw new Error('Timeout waiting for job');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

            {/* LEFT COLUMN: Controls & Input (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-100">Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Mode Switcher */}
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

                        {/* URL Input (Optional) */}
                        <div className="space-y-2">
                            <Label className="text-slate-400">Website URL (Optional)</Label>
                            <input
                                type="text"
                                placeholder="https://google.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200 text-sm"
                            />
                            <p className="text-xs text-slate-500">Leave empty to use HTML editor below.</p>
                        </div>

                        {/* PDF Options */}
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
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Layout</Label>
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

                        {/* Screenshot Options */}
                        {mode === 'screenshot' && (
                            <div className="space-y-2">
                                <Label className="text-slate-400">Scale: {scale}x</Label>
                                <input
                                    type="range" min="1" max="3" step="1"
                                    value={scale}
                                    onChange={(e) => setScale(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                            </div>
                        )}

                        <Button
                            onClick={handleRender}
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-10"
                        >
                            {loading ? 'Processing...' : `Generate ${mode === 'pdf' ? 'PDF' : 'Image'}`}
                        </Button>
                    </CardContent>
                </Card>

                {/* HTML Editor */}
                <Card className="bg-slate-900 border-slate-800 flex-1">
                    <CardHeader>
                        <CardTitle className="text-slate-100">HTML Input</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            className="w-full h-[300px] bg-slate-950 text-slate-300 font-mono text-xs p-4 rounded-md border border-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            disabled={!!url} // Disable if URL is set
                        />
                    </CardContent>
                </Card>
            </div>

            {/* RIGHT COLUMN: PREVIEW (8 cols) */}
            <div className="lg:col-span-8 h-full min-h-[600px]">
                <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                    <CardHeader className="border-b border-slate-800 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-slate-100">Live Preview</CardTitle>
                            {resultUrl && (
                                <a
                                    href={resultUrl}
                                    target="_blank"
                                    download
                                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                                >
                                    Download Result ↗
                                </a>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 bg-slate-950 relative overflow-hidden flex items-center justify-center">

                        {/* 1. LOADING STATE */}
                        {loading && (
                            <div className="text-center space-y-4">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-slate-400 animate-pulse">Rendering in cloud...</p>
                            </div>
                        )}

                        {/* 2. EMPTY STATE */}
                        {!loading && !resultUrl && (
                            <div className="text-slate-600 text-center">
                                <p>No result generated yet.</p>
                                <p className="text-sm">Click "Generate" to see preview here.</p>
                            </div>
                        )}

                        {/* 3. PDF PREVIEW */}
                        {!loading && resultUrl && mode === 'pdf' && (
                            <iframe
                                src={resultUrl}
                                className="w-full h-full border-none"
                                title="PDF Preview"
                            />
                        )}

                        {/* 4. IMAGE PREVIEW */}
                        {!loading && resultUrl && mode === 'screenshot' && (
                            <div className="p-8 overflow-auto w-full h-full flex items-start justify-center bg-[#1a1a1a]">
                                <img
                                    src={resultUrl}
                                    alt="Screenshot Preview"
                                    className="max-w-full shadow-2xl border border-slate-800 rounded-lg"
                                />
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}