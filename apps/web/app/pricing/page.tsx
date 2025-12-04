'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 pt-20">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between py-4 px-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-100">
                        <div className="h-6 w-6 rounded bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                        RenderFlux
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <Link href="/#features" className="hover:text-cyan-400 transition-colors">Features</Link>
                        <Link href="/pricing" className="text-cyan-400 transition-colors">Pricing</Link>
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

            <div className="container mx-auto px-4 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-100 mb-4">Simple, transparent pricing</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-8">
                        Choose the plan that fits your needs. No hidden fees.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-100' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-12 h-6 bg-slate-800 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-cyan-500 transition-all ${isAnnual ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-slate-100' : 'text-slate-500'}`}>
                            Yearly <span className="text-cyan-400 text-xs ml-1">(Save 20%)</span>
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
                    {/* Hobby */}
                    <Card className="bg-slate-950 border-slate-800 flex flex-col hover:border-slate-700 transition-all">
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-100">Hobby</CardTitle>
                            <CardDescription>For side projects and testing.</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-slate-100">Free</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> 50 Credits / month</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> Community Support</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> Basic PDF Rendering</li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200">Get Started</Button>
                        </div>
                    </Card>

                    {/* Pro */}
                    <Card className="bg-slate-900 border-cyan-500/50 relative shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-100">Pro</CardTitle>
                            <CardDescription>For growing businesses.</CardDescription>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-slate-100">${isAnnual ? '24' : '29'}</span>
                                <span className="text-slate-500">/mo</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> 5,000 Credits / month</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Priority Email Support</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Advanced Options (Landscape, Margins)</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-400" /> Screenshot API</li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">Start Free Trial</Button>
                        </div>
                    </Card>

                    {/* Enterprise */}
                    <Card className="bg-slate-950 border-slate-800 flex flex-col hover:border-slate-700 transition-all">
                        <CardHeader>
                            <CardTitle className="text-2xl text-slate-100">Enterprise</CardTitle>
                            <CardDescription>For high-volume needs.</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold text-slate-100">Custom</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> Unlimited Credits</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> 24/7 Dedicated Support</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> SLA & Uptime Guarantee</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-cyan-500" /> Custom Integration</li>
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">Contact Sales</Button>
                        </div>
                    </Card>
                </div>

                {/* Comparison Table */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-slate-100 mb-8 text-center">Compare Plans</h2>
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/50">
                                    <th className="p-4 text-slate-400 font-medium w-1/3">Feature</th>
                                    <th className="p-4 text-slate-200 font-bold text-center w-1/5">Hobby</th>
                                    <th className="p-4 text-cyan-400 font-bold text-center w-1/5">Pro</th>
                                    <th className="p-4 text-slate-200 font-bold text-center w-1/5">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr>
                                    <td className="p-4 text-slate-300">Monthly Credits</td>
                                    <td className="p-4 text-center text-slate-400">50</td>
                                    <td className="p-4 text-center text-slate-100 font-bold">5,000</td>
                                    <td className="p-4 text-center text-slate-400">Unlimited</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-slate-300">Concurrent Requests</td>
                                    <td className="p-4 text-center text-slate-400">1</td>
                                    <td className="p-4 text-center text-slate-100 font-bold">10</td>
                                    <td className="p-4 text-center text-slate-400">Custom</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-slate-300">Retention</td>
                                    <td className="p-4 text-center text-slate-400">24 Hours</td>
                                    <td className="p-4 text-center text-slate-100 font-bold">30 Days</td>
                                    <td className="p-4 text-center text-slate-400">Custom</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-slate-300">Support</td>
                                    <td className="p-4 text-center text-slate-400">Community</td>
                                    <td className="p-4 text-center text-slate-100 font-bold">Priority Email</td>
                                    <td className="p-4 text-center text-slate-400">Dedicated Slack</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-slate-300">SLA</td>
                                    <td className="p-4 text-center text-slate-400"><X className="w-4 h-4 mx-auto text-slate-600" /></td>
                                    <td className="p-4 text-center text-slate-100 font-bold">99.9%</td>
                                    <td className="p-4 text-center text-slate-400">99.99%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
