'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Activity, CreditCard, Key, FileText, ArrowRight, ExternalLink, Zap } from 'lucide-react';
import Link from 'next/link';
import { UsageBar } from '@/components/dashboard/UsageBar';
import { OverviewChart } from '@/components/dashboard/OverviewChart';
import { createClient } from '@/lib/supabase';
import { getUsageStats, getRecentLogs, getUserPlan, getDailyStats } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total_requests: 0, credits_used: 0 });
    const [plan, setPlan] = useState({ plan: 'hobby', credits_limit: 50 });
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [dailyStats, setDailyStats] = useState<{ name: string; total: number }[]>([]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [usageData, planData, logsData, dailyData] = await Promise.all([
                    getUsageStats(supabase),
                    getUserPlan(supabase),
                    getRecentLogs(supabase, 5),
                    getDailyStats(supabase)
                ]);

                setStats(usageData);
                setPlan(planData);
                setRecentLogs(logsData);
                setDailyStats(dailyData);
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const usagePercentage = Math.min(100, (stats.credits_used / plan.credits_limit) * 100);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-2">Overview</h1>
                <p className="text-slate-400">Welcome back to RenderFlux.</p>
            </div>

            {/* Stats Row */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Current Plan</CardTitle>
                        <CreditCard className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100 capitalize">{plan.plan}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {plan.plan === 'hobby' ? 'Free Forever' : '$29/month'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Requests</CardTitle>
                        <Activity className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">{stats.total_requests.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            This month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">API Keys</CardTitle>
                        <Key className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-100">Active</div>
                        <div className="mt-2">
                            <Link href="/dashboard/keys" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                Manage Keys <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-100">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={dailyStats} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-100">Usage Limits</CardTitle>
                        <CardDescription>Reset on the 1st of every month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UsageBar
                            used={stats.credits_used}
                            total={plan.credits_limit}
                            label="Monthly Credits"
                        />
                        <div className="mt-4 text-right">
                            {plan.plan === 'hobby' && (
                                <Link href="/dashboard/billing">
                                    <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300 hover:text-white">
                                        Upgrade Plan
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-100">Recent Activity</h2>
                    <Link href="/dashboard/logs">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                            View All
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="h-32 flex items-center justify-center border border-slate-800 rounded-lg bg-slate-900/50">
                        <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : recentLogs.length > 0 ? (
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900 text-slate-400 font-medium">
                                <tr>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                    <th className="p-4">Duration</th>
                                    <th className="p-4 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-950">
                                {recentLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.status === 'completed' || (log.status >= 200 && log.status < 300)
                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                : log.status === 'queued'
                                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {log.status === 'queued' ? 'Processing' : log.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-slate-300 capitalize">{log.action || 'Render'}</td>
                                        <td className="p-4 text-slate-400">{log.duration_ms}ms</td>
                                        <td className="p-4 text-right text-slate-500">
                                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg bg-slate-900/20">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="w-6 h-6 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-200 mb-2">No activity yet</h3>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Send your first API request to see it appear here. Check out the playground to get started.
                        </p>
                        <Link href="/dashboard/playground">
                            <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                                Go to Playground
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
