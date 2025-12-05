'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export default function LogsPage() {
    const supabase = createClient();
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('usage_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50); // Simple limit for now, pagination could be added

            if (data) {
                setLogs(data);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-2">Developer Logs</h1>
                <p className="text-slate-400">Inspect your recent API requests and debug issues.</p>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Search logs by ID or status..."
                        className="pl-10 bg-slate-900 border-slate-800 focus:border-cyan-500"
                    />
                </div>
                <Button variant="outline" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-slate-400 hover:text-cyan-400"
                    onClick={fetchLogs}
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                <table className="w-full text-left text-sm table-fixed">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-medium">
                        <tr>
                            <th className="p-4 w-32">Status</th>
                            <th className="p-4 w-24">Method</th>
                            <th className="p-4 w-full">Path</th>
                            <th className="p-4 w-32">Duration</th>
                            <th className="p-4 w-48 text-right">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading && logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    Loading logs...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-900/30 transition-colors group">
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status >= 200 && log.status < 300
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : log.status >= 500
                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-slate-300">{log.method}</td>
                                    <td className="p-4 font-mono text-slate-400 truncate" title={log.path}>
                                        {log.path}
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono">
                                        {log.duration_ms}ms
                                    </td>
                                    <td className="p-4 text-right text-slate-500 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 px-2">
                <span>Showing {logs.length} most recent logs</span>
                {/* Pagination placeholder */}
            </div>
        </div>
    );
}
