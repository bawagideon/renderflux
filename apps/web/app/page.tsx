import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            <header className="container mx-auto flex items-center justify-between py-6 px-4">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-100">
                    <div className="h-6 w-6 rounded bg-cyan-500" />
                    RenderFlux
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <Link href="#" className="hover:text-slate-200">Features</Link>
                    <Link href="#" className="hover:text-slate-200">Pricing</Link>
                    <Link href="#" className="hover:text-slate-200">Docs</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-300 hover:text-white">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">Sign Up</Button>
                    </Link>
                </div>
            </header>

            <main>
                <section className="container mx-auto px-4 py-24 text-center lg:py-32">
                    <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-100 sm:text-7xl">
                        The Enterprise <span className="text-cyan-500">PDF Engine</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                        Convert HTML/CSS to PDF with pixel-perfect accuracy. Built for developers who need speed, reliability, and scale.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 h-12 px-8 text-base">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-700 text-slate-300 hover:bg-slate-800">
                            View Documentation
                        </Button>
                    </div>
                </section>

                <section className="border-t border-slate-900 bg-slate-950/50 py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-12 md:grid-cols-3">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-100">Pixel Perfect</h3>
                                <p className="text-slate-400">
                                    Uses the latest Chrome engine to ensure your PDFs look exactly like your HTML.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-100">Lightning Fast</h3>
                                <p className="text-slate-400">
                                    Optimized for speed. Generate thousands of documents in seconds with our bulk API.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-100">Developer First</h3>
                                <p className="text-slate-400">
                                    Simple REST API, webhooks, and SDKs for your favorite languages.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-900 py-12">
                <div className="container mx-auto px-4 text-center text-slate-500">
                    <p>&copy; 2024 RenderFlux. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
