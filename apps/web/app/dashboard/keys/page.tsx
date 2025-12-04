'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Copy, Plus } from 'lucide-react';

const keys = [
    { name: 'Production Key', token: 'sk_live_...4a2b', lastUsed: '2 mins ago', created: 'Oct 24, 2023' },
    { name: 'Development Key', token: 'sk_test_...9x1z', lastUsed: '1 hour ago', created: 'Nov 01, 2023' },
];

export default function ApiKeysPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">API Keys</h1>
                    <p className="text-slate-400">Manage your API keys for accessing RenderFlux.</p>
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">
                    <Plus className="mr-2 h-4 w-4" />
                    New API Key
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Keys</CardTitle>
                    <CardDescription>Do not share your secret keys with anyone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-800">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Token</th>
                                    <th className="px-4 py-3">Last Used</th>
                                    <th className="px-4 py-3">Created On</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                                {keys.map((key) => (
                                    <tr key={key.name} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-200">{key.name}</td>
                                        <td className="px-4 py-3 font-mono text-slate-400">{key.token}</td>
                                        <td className="px-4 py-3 text-slate-400">{key.lastUsed}</td>
                                        <td className="px-4 py-3 text-slate-400">{key.created}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-cyan-400">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </td>
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
