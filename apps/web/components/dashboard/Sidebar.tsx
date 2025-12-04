'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Key, CreditCard, Settings, BookOpen, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Logs', href: '/dashboard/logs', icon: FileText },
    { name: 'API Keys', href: '/dashboard/keys', icon: Key },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-[250px] flex-col border-r border-slate-800 bg-slate-950">
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-100">
                    <div className="h-6 w-6 rounded bg-cyan-500" /> {/* Logo placeholder */}
                    RenderFlux
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-900 text-cyan-400"
                                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="my-4 border-t border-slate-800 mx-2" />

                    <Link
                        href="https://docs.renderflux.com"
                        target="_blank"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 mx-2"
                    >
                        <BookOpen className="h-4 w-4" />
                        Documentation
                    </Link>
                </nav>
            </div>

            <div className="border-t border-slate-800 p-4">
                <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-slate-900">
                    <LogOut className="h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
