'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LogsPage() {
    const logs = [
        { id: 'req_1', method: 'POST', path: '/render', status: 200, duration: '124ms', time: '2 mins ago' },
        { id: 'req_2', method: 'POST', path: '/render', status: 200, duration: '89ms', time: '5 mins ago' },
        { id: 'req_3', method: 'GET', path: '/jobs/job_123', status: 200, duration: '45ms', time: '12 mins ago' },
        { id: 'req_4', method: 'POST', path: '/render', status: 400, duration: '22ms', time: '15 mins ago' },
        { id: 'req_5', method: 'POST', path: '/render', status: 200, duration: '156ms', time: '22 mins ago' },
        { id: 'req_6', method: 'POST', path: '/bulk', status: 202, duration: '450ms', time: '30 mins ago' },
        { id: 'req_7', method: 'GET', path: '/batches/batch_99', status: 200, duration: '34ms', time: '32 mins ago' },
        { id: 'req_8', method: 'POST', path: '/render', status: 200, duration: '112ms', time: '45 mins ago' },
        { id: 'req_9', method: 'POST', path: '/render', status: 500, duration: '5000ms', time: '1 hour ago' },
        { id: 'req_10', method: 'POST', path: '/render', status: 200, duration: '98ms', time: '1 hour ago' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Developer Logs</h1>
                    <p className="text-slate-400">Real-time logs of your API usage.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input placeholder="Search logs..." className="pl-9 bg-slate-900 border-slate-800 focus:border-cyan-500" />
                </div>
                <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-0">
                    <div className="rounded-md overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Method</th>
                                    <th className="px-4 py-3">Path</th>
                                    <th className="px-4 py-3">Duration</th>
                                    <th className="px-4 py-3 text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/50 transition-colors font-mono">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${log.status >= 500 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                                        log.status >= 400 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' :
                                                            'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                                                    }`} />
                                                <span className={
                                                    log.status >= 500 ? 'text-red-400' :
                                                        log.status >= 400 ? 'text-yellow-400' :
                                                            'text-green-400'
                                                }>{log.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300">{log.method}</td>
                                        <td className="px-4 py-3 text-slate-400">{log.path}</td>
                                        <td className="px-4 py-3 text-slate-500">{log.duration}</td>
                                        <td className="px-4 py-3 text-right text-slate-500">{log.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
