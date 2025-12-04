'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const sidebarItems = [
    {
        section: 'Getting Started',
        items: [
            { name: 'Introduction', href: '/docs' },
            { name: 'Authentication', href: '/docs/authentication' },
        ],
    },
    {
        section: 'API Reference',
        items: [
            { name: 'Render Endpoint', href: '/docs/api-reference' },
            { name: 'Bulk Processing', href: '/docs/bulk' },
        ],
    },
    {
        section: 'Libraries',
        items: [
            { name: 'Node.js', href: '#' },
            { name: 'Python', href: '#' },
            { name: 'PHP', href: '#' },
        ],
    },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

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
                        <Link href="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link>
                        <Link href="/docs" className="text-cyan-400 transition-colors">Docs</Link>
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

            <div className="container mx-auto px-4 flex">
                {/* Sidebar */}
                <aside className="w-64 hidden md:block fixed h-[calc(100vh-80px)] overflow-y-auto border-r border-slate-800 py-8 pr-4">
                    <div className="space-y-8">
                        {sidebarItems.map((section) => (
                            <div key={section.section}>
                                <h4 className="font-bold text-slate-100 mb-3 px-2 text-sm uppercase tracking-wider">{section.section}</h4>
                                <ul className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "block px-2 py-1.5 text-sm rounded-md transition-colors",
                                                        isActive
                                                            ? "text-cyan-400 bg-slate-900 font-medium"
                                                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 py-8 md:pl-12 max-w-4xl min-h-[calc(100vh-80px)]">
                    {children}
                </main>
            </div>
        </div>
    );
}
