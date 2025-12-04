'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function IntroductionPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Docs</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-200">Introduction</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-100">Welcome to RenderFlux</h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                    RenderFlux is the developer-first API for high-fidelity PDF generation.
                    We handle the complex infrastructure of headless Chrome so you can focus on building your product.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Hello World</h2>
                <p className="text-slate-400">
                    Generate your first PDF in seconds using cURL. You'll need an API Key from your dashboard.
                </p>
                <CodeBlock
                    code={`curl -X POST https://api.renderflux.io/render \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<h1>Hello World</h1>",
    "format": "A4"
  }' \\
  --output doc.pdf`}
                />
            </section>

            <section className="grid md:grid-cols-2 gap-4 pt-4">
                <Link
                    href="/docs/authentication"
                    className="block p-6 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-cyan-500/50 transition-all group"
                >
                    <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">Authentication &rarr;</h3>
                    <p className="text-sm text-slate-400">Learn how to authenticate your requests securely.</p>
                </Link>
                <Link
                    href="/docs/api-reference"
                    className="block p-6 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-cyan-500/50 transition-all group"
                >
                    <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">API Reference &rarr;</h3>
                    <p className="text-sm text-slate-400">Explore all available endpoints and parameters.</p>
                </Link>
            </section>
        </div>
    );
}
