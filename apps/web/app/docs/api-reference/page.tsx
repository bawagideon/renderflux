'use client';

import { ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Endpoint } from '@/components/docs/Endpoint';
import { Badge } from '@/components/ui/Badge';

export default function ApiReferencePage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Docs</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>API Reference</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-200">Render Endpoint</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-100">Render Endpoint</h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                    The core endpoint for generating PDFs and screenshots.
                </p>
            </div>

            <section className="space-y-4">
                <Endpoint method="POST" path="https://api.renderflux.io/render" />
                <p className="text-slate-400">
                    Converts HTML or a URL into a PDF or screenshot.
                </p>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100">Parameters</h2>

                <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
                            <tr>
                                <th className="p-4 font-medium">Parameter</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="p-4 font-mono text-cyan-400">html</td>
                                <td className="p-4 text-slate-400">string</td>
                                <td className="p-4 text-slate-300">
                                    The raw HTML content to render. Required if <code className="text-slate-400">url</code> is not provided.
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-cyan-400">url</td>
                                <td className="p-4 text-slate-400">string</td>
                                <td className="p-4 text-slate-300">
                                    The URL to render. Required if <code className="text-slate-400">html</code> is not provided.
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-cyan-400">type</td>
                                <td className="p-4 text-slate-400">string</td>
                                <td className="p-4 text-slate-300">
                                    The output format. Either <code className="text-slate-400">pdf</code> (default) or <code className="text-slate-400">screenshot</code>.
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-cyan-400">options</td>
                                <td className="p-4 text-slate-400">object</td>
                                <td className="p-4 text-slate-300">
                                    Configuration options for the rendering engine.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-100">Options Object</h2>
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
                            <tr>
                                <th className="p-4 font-medium">Option</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            <tr>
                                <td className="p-4 font-mono text-purple-400">format</td>
                                <td className="p-4 text-slate-400">string</td>
                                <td className="p-4 text-slate-300">
                                    Paper format. <code className="text-slate-400">A4</code>, <code className="text-slate-400">Letter</code>, <code className="text-slate-400">A3</code>, etc.
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-purple-400">landscape</td>
                                <td className="p-4 text-slate-400">boolean</td>
                                <td className="p-4 text-slate-300">
                                    Whether to render in landscape mode. Default <code className="text-slate-400">false</code>.
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-purple-400">margin</td>
                                <td className="p-4 text-slate-400">object</td>
                                <td className="p-4 text-slate-300">
                                    Page margins. <code className="text-slate-400">{`{ top, right, bottom, left }`}</code>.
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-mono text-purple-400">waitFor</td>
                                <td className="p-4 text-slate-400">string</td>
                                <td className="p-4 text-slate-300">
                                    Wait strategy. <code className="text-slate-400">networkidle</code>, <code className="text-slate-400">domcontentloaded</code>.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Example Request</h2>
                <CodeBlock
                    code={`{
  "html": "<h1>Invoice</h1>",
  "type": "pdf",
  "options": {
    "format": "A4",
    "landscape": true,
    "margin": { "top": "20px" }
  }
}`}
                    language="json"
                />
            </section>
        </div>
    );
}
