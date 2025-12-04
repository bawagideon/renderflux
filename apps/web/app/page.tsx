'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowRight, CheckCircle2, Code2, Server, FileText, Terminal, Check, X, ChevronDown, Lock, Zap, Globe, Database, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState<'node' | 'python' | 'curl' | 'php'>('node');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const codeSnippets = {
        node: `import axios from 'axios';

// Render HTML to PDF
const response = await axios.post('https://api.renderflux.io/render', {
  html: '<h1>Invoice #1023</h1><p>Total: $500.00</p>',
  format: 'A4',
  margin: { top: '20px', bottom: '20px' }
}, {
  headers: { 
    'Authorization': 'Bearer sk_live_51Mz...',
    'Content-Type': 'application/json'
  },
  responseType: 'arraybuffer' // Important for binary data
});

// Save the PDF
const fs = require('fs');
fs.writeFileSync('invoice.pdf', response.data);`,
        python: `import requests

# Render HTML to PDF
response = requests.post(
    'https://api.renderflux.io/render',
    json={
        'html': '<h1>Invoice #1023</h1><p>Total: $500.00</p>',
        'format': 'A4',
        'margin': { 'top': '20px', 'bottom': '20px' }
    },
    headers={
        'Authorization': 'Bearer sk_live_51Mz...',
        'Content-Type': 'application/json'
    }
)

# Save the PDF
with open('invoice.pdf', 'wb') as f:
    f.write(response.content)`,
        curl: `curl -X POST https://api.renderflux.io/render \\
  -H "Authorization: Bearer sk_live_51Mz..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<h1>Invoice #1023</h1><p>Total: $500.00</p>",
    "format": "A4",
    "margin": { "top": "20px", "bottom": "20px" }
  }' \\
  --output invoice.pdf`,
        php: `<?php
require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();

// Render HTML to PDF
$response = $client->post('https://api.renderflux.io/render', [
    'headers' => [
        'Authorization' => 'Bearer sk_live_51Mz...',
        'Content-Type' => 'application/json'
    ],
    'json' => [
        'html' => '<h1>Invoice #1023</h1><p>Total: $500.00</p>',
        'format' => 'A4',
        'margin' => ['top' => '20px', 'bottom' => '20px']
    ]
]);

// Save the PDF
file_put_contents('invoice.pdf', $response->getBody());`
    };

    const faqs = [
        { q: "How does billing work?", a: "We charge based on the number of successful render requests. Failed requests are not billed. You can upgrade or downgrade your plan at any time." },
        { q: "Can I self-host?", a: "Currently, RenderFlux is a managed cloud service. We handle the infrastructure scaling and maintenance so you don't have to." },
        { q: "What is the retention policy?", a: "We do not store your generated PDFs. Once the response is sent to you, the file is deleted from our servers immediately for security." },
        { q: "Do you support Puppeteer scripts?", a: "We support standard HTML/CSS rendering. For security and performance reasons, we do not currently support executing arbitrary Puppeteer scripts." }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-100">
                        <div className="h-6 w-6 rounded bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                        RenderFlux
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <Link href="#features" className="hover:text-cyan-400 transition-colors">Features</Link>
                        <Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
                        <Link href="/docs" className="hover:text-cyan-400 transition-colors">Docs</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-24 text-center lg:py-32 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-10" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="mb-6 border-cyan-500/30 text-cyan-400 bg-cyan-500/5 px-4 py-1.5 text-sm backdrop-blur-sm">
                            v2.0 is now live: Faster rendering engine
                        </Badge>

                        <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-slate-100 sm:text-7xl mb-8 leading-tight">
                            The Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">PDF Engine</span>
                            <br />for Developers.
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
                            Convert HTML/CSS to PDF with pixel-perfect accuracy. Built for developers who need speed, reliability, and scale. Stop wrestling with Puppeteer.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                            <Link href="/dashboard">
                                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 h-14 px-8 text-lg font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] w-full sm:w-auto">
                                    Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/docs">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white w-full sm:w-auto">
                                    View Documentation
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Trusted By */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="pt-8 border-t border-slate-800/50 max-w-4xl mx-auto"
                    >
                        <p className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-wider">Trusted by engineering teams at</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map((company) => (
                                <span key={company} className="text-xl font-bold text-slate-400 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-600 rounded-full" />
                                    {company}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Sticky Scroll Features */}
                <section id="features" className="py-24 bg-slate-900/30 border-y border-slate-800/50">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-16 items-start">
                            <div className="sticky top-32 space-y-12">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                                        <Zap className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-100">Atomic Batching</h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        Process thousands of documents in parallel. Our batching engine handles the queueing, retries, and concurrency for you.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20">
                                        <Database className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-100">Smart Caching</h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        We automatically cache identical requests at the edge, reducing latency and costs for frequently generated documents.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <Card className="bg-slate-950 border-slate-800 overflow-hidden shadow-2xl">
                                    <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                        <span className="ml-2 text-xs text-slate-500 font-mono">batch_request.json</span>
                                    </div>
                                    <div className="p-6 font-mono text-sm text-slate-300">
                                        <div className="text-purple-400">POST /v1/batch</div>
                                        <div className="text-slate-500">{`{`}</div>
                                        <div className="pl-4">
                                            <span className="text-cyan-400">"items"</span>: [
                                        </div>
                                        <div className="pl-8 text-slate-400">
                                            {`{ "html": "<h1>Doc 1</h1>" },`}
                                        </div>
                                        <div className="pl-8 text-slate-400">
                                            {`{ "html": "<h1>Doc 2</h1>" },`}
                                        </div>
                                        <div className="pl-8 text-slate-500">...</div>
                                        <div className="pl-4">]</div>
                                        <div className="text-slate-500">{`}`}</div>
                                    </div>
                                </Card>
                                <div className="h-64 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                    <div className="relative z-10 text-center">
                                        <div className="text-5xl font-bold text-slate-100 mb-2">95ms</div>
                                        <div className="text-slate-400">Average Cache Hit Latency</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid */}
                <section className="py-24 container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-100 mb-4">Everything you need</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Built for reliability and scale.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <Card className="md:col-span-2 bg-slate-900 border-slate-800 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-cyan-500" /> Global Edge</CardTitle>
                                <CardDescription>Requests are routed to the nearest region for lowest latency.</CardDescription>
                            </CardHeader>
                            <div className="h-32 bg-slate-950/50 mt-4 mx-6 rounded-t-lg border-t border-x border-slate-800 relative">
                                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                                <div className="absolute top-1/3 left-2/3 w-2 h-2 bg-purple-500 rounded-full animate-ping" />
                                <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                            </div>
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 group hover:border-slate-700 transition-colors">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ToggleRight className="w-5 h-5 text-purple-500" /> Zero Config</CardTitle>
                                <CardDescription>No servers to manage. Just API keys.</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="bg-slate-900 border-slate-800 group hover:border-slate-700 transition-colors">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-green-500" /> Secure</CardTitle>
                                <CardDescription>SOC2 Compliant infrastructure.</CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="md:col-span-2 bg-slate-900 border-slate-800 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" /> 99.9% Uptime</CardTitle>
                                <CardDescription>Guaranteed by our SLA for enterprise customers.</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </section>

                {/* Full Width Code Wall */}
                <section className="py-24 bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
                    <div className="container mx-auto px-4 relative">
                        <div className="text-center mb-12">
                            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20 mb-4">Developer Experience</Badge>
                            <h2 className="text-4xl font-bold text-slate-100 mb-4">Integrate in minutes, not days.</h2>
                            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                                We provide SDKs for all major languages. Whether you're building a Node.js backend or a Python script, we've got you covered.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            <div className="bg-[#0B1120] rounded-xl border border-slate-800 overflow-hidden shadow-2xl ring-1 ring-slate-800/50">
                                <div className="flex items-center border-b border-slate-800 px-4 bg-slate-900/50 backdrop-blur">
                                    <div className="flex gap-2 py-4 mr-6">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                        {(['node', 'python', 'php', 'curl'] as const).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => setActiveTab(lang)}
                                                className={cn(
                                                    "px-6 py-3 text-sm font-medium transition-all relative",
                                                    activeTab === lang
                                                        ? "text-cyan-400 bg-slate-800/50"
                                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                                                )}
                                            >
                                                {lang === 'node' ? 'Node.js' : lang === 'python' ? 'Python' : lang === 'php' ? 'PHP' : 'cURL'}
                                                {activeTab === lang && (
                                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-8 overflow-x-auto min-h-[400px] flex items-center">
                                    <pre className="font-mono text-sm leading-relaxed w-full">
                                        <code className="block text-slate-300">
                                            {codeSnippets[activeTab].split('\n').map((line, i) => (
                                                <div key={i} className="table-row">
                                                    <span className="table-cell text-right pr-6 text-slate-700 select-none w-8">{i + 1}</span>
                                                    <span className="table-cell">{line}</span>
                                                </div>
                                            ))}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive FAQ */}
                <section className="py-24 container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-100 mb-4">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors"
                                >
                                    <span className="font-medium text-slate-200">{faq.q}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-slate-400 border-t border-slate-800/50">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 container mx-auto px-4 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
                    <h2 className="text-4xl font-bold text-slate-100 mb-6">Ready to start building?</h2>
                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Join thousands of developers generating millions of PDFs every month.
                    </p>
                    <Link href="/register">
                        <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 h-14 px-12 text-lg font-bold shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all transform hover:-translate-y-1">
                            Get Started for Free
                        </Button>
                    </Link>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-900 bg-slate-950 py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                            <div className="col-span-2 md:col-span-1">
                                <div className="flex items-center gap-2 font-bold text-xl text-slate-100 mb-4">
                                    <div className="h-6 w-6 rounded bg-cyan-500" />
                                    RenderFlux
                                </div>
                                <p className="text-slate-500 text-sm">
                                    The enterprise-grade PDF generation API for developers.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-100 mb-4">Product</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="#features" className="hover:text-cyan-400">Features</Link></li>
                                    <li><Link href="/pricing" className="hover:text-cyan-400">Pricing</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">API</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Showcase</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-100 mb-4">Resources</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="/docs" className="hover:text-cyan-400">Documentation</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Blog</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Community</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Help Center</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-100 mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="#" className="hover:text-cyan-400">Privacy Policy</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Terms of Service</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Cookie Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-slate-900 pt-8 text-center text-slate-600 text-sm">
                            &copy; {new Date().getFullYear()} RenderFlux Inc. All rights reserved.
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}
