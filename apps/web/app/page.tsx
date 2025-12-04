'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ArrowRight, CheckCircle2, Code2, Server, FileText, Terminal, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
    const [activeTab, setActiveTab] = useState<'node' | 'python' | 'curl' | 'php'>('node');

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

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-4">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-100">
                        <div className="h-6 w-6 rounded bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                        RenderFlux
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <Link href="#features" className="hover:text-cyan-400 transition-colors">Features</Link>
                        <Link href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
                        <Link href="#docs" className="hover:text-cyan-400 transition-colors">Docs</Link>
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
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white w-full sm:w-auto">
                            View Documentation
                        </Button>
                    </div>

                    {/* Trusted By */}
                    <div className="pt-8 border-t border-slate-800/50 max-w-4xl mx-auto">
                        <p className="text-sm text-slate-500 mb-6 font-medium uppercase tracking-wider">Trusted by engineering teams at</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'].map((company) => (
                                <span key={company} className="text-xl font-bold text-slate-400 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-600 rounded-full" />
                                    {company}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-24 bg-slate-900/50 border-y border-slate-800/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-100 mb-4">How RenderFlux Works</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Simple, reliable, and fast. Just send us your HTML, and we'll handle the rest.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
                            <Card className="flex-1 bg-slate-950 border-slate-800 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
                                        <Code2 className="w-8 h-8 text-cyan-500" />
                                    </div>
                                    <CardTitle className="text-xl">1. Send JSON</CardTitle>
                                    <CardDescription>
                                        Send your HTML or URL via our REST API.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <ArrowRight className="hidden md:block w-8 h-8 text-slate-700" />
                            <div className="md:hidden w-px h-12 bg-slate-800" />

                            <Card className="flex-1 bg-slate-950 border-slate-800 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
                                        <Server className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <CardTitle className="text-xl">2. We Render</CardTitle>
                                    <CardDescription>
                                        Our cluster renders it in a headless Chrome instance.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <ArrowRight className="hidden md:block w-8 h-8 text-slate-700" />
                            <div className="md:hidden w-px h-12 bg-slate-800" />

                            <Card className="flex-1 bg-slate-950 border-slate-800 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CardHeader className="text-center">
                                    <div className="mx-auto w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 group-hover:border-green-500/30 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all">
                                        <FileText className="w-8 h-8 text-green-500" />
                                    </div>
                                    <CardTitle className="text-xl">3. Get PDF</CardTitle>
                                    <CardDescription>
                                        Receive your pixel-perfect PDF instantly.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
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

                {/* Use Cases Bento Grid */}
                <section className="py-24 bg-slate-900/30 border-y border-slate-800/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-100 mb-4">Built for every use case</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                From simple invoices to complex reports, RenderFlux handles it all.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {[
                                { title: 'Invoices & Receipts', icon: FileText, desc: 'Generate millions of invoices with dynamic data.' },
                                { title: 'Legal Contracts', icon: CheckCircle2, desc: 'Create secure, read-only PDF contracts.' },
                                { title: 'Reports & Analytics', icon: ArrowRight, desc: 'Turn your dashboards into downloadable reports.' },
                                { title: 'Tickets & Vouchers', icon: Terminal, desc: 'Generate QR-code enabled tickets instantly.' }
                            ].map((item, i) => (
                                <Card key={i} className="bg-slate-950 border-slate-800 hover:border-slate-700 transition-all hover:shadow-lg group">
                                    <CardHeader>
                                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-slate-800 transition-colors">
                                            <item.icon className="w-6 h-6 text-cyan-500" />
                                        </div>
                                        <CardTitle className="text-slate-100">{item.title}</CardTitle>
                                        <CardDescription className="text-slate-400">
                                            {item.desc}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Comparison Section */}
                <section className="py-24 container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-100 mb-4">Why RenderFlux?</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Stop managing headless Chrome instances. Let us handle the infrastructure.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50">
                                    <th className="p-6 text-slate-400 font-medium">Feature</th>
                                    <th className="p-6 text-cyan-400 font-bold text-lg">RenderFlux</th>
                                    <th className="p-6 text-slate-400 font-medium">Puppeteer / DIY</th>
                                    <th className="p-6 text-slate-400 font-medium">Competitors</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr>
                                    <td className="p-6 text-slate-200 font-medium">Speed</td>
                                    <td className="p-6 text-cyan-400 font-bold flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Instant
                                    </td>
                                    <td className="p-6 text-slate-500">Slow (Cold starts)</td>
                                    <td className="p-6 text-slate-500">Variable</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-slate-200 font-medium">Maintenance</td>
                                    <td className="p-6 text-cyan-400 font-bold flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Zero
                                    </td>
                                    <td className="p-6 text-slate-500">High (Updates, Crashing)</td>
                                    <td className="p-6 text-slate-500">Zero</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-slate-200 font-medium">Cost</td>
                                    <td className="p-6 text-cyan-400 font-bold flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Low
                                    </td>
                                    <td className="p-6 text-slate-500">High (Server costs)</td>
                                    <td className="p-6 text-slate-500">Expensive</td>
                                </tr>
                                <tr>
                                    <td className="p-6 text-slate-200 font-medium">Scalability</td>
                                    <td className="p-6 text-cyan-400 font-bold flex items-center gap-2">
                                        <Check className="w-4 h-4" /> Infinite
                                    </td>
                                    <td className="p-6 text-slate-500">Hard to scale</td>
                                    <td className="p-6 text-slate-500">Limited</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                                    <li><Link href="#" className="hover:text-cyan-400">Features</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Pricing</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">API</Link></li>
                                    <li><Link href="#" className="hover:text-cyan-400">Showcase</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-100 mb-4">Resources</h4>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li><Link href="#" className="hover:text-cyan-400">Documentation</Link></li>
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
