'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface ApiKey {
    id: string;
    name: string;
    key_value: string;
    created_at: string;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching keys:', error);
        } else {
            setKeys(data || []);
        }
        setLoading(false);
    };

    const generateKey = async () => {
        setGenerating(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // Generate a random key (in a real app, this might happen on the backend)
        const newKey = `sk_live_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;

        const { error } = await supabase
            .from('api_keys')
            .insert([{
                user_id: user.id,
                key_value: newKey,
                name: `Key ${keys.length + 1}`
            }]);

        if (error) {
            console.error('Error creating key:', error);
        } else {
            await fetchKeys();
        }
        setGenerating(false);
    };

    const deleteKey = async (id: string) => {
        if (!confirm('Are you sure you want to delete this API key?')) return;

        const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting key:', error);
        } else {
            setKeys(keys.filter(k => k.id !== id));
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">API Keys</h1>
                    <p className="text-slate-400">Manage your API keys for accessing RenderFlux.</p>
                </div>
                <Button
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                    onClick={generateKey}
                    disabled={generating}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {generating ? 'Generating...' : 'New API Key'}
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
                                    <th className="px-4 py-3">Created</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading keys...</td>
                                    </tr>
                                ) : keys.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No API keys found. Create one to get started.</td>
                                    </tr>
                                ) : (
                                    keys.map((key) => (
                                        <tr key={key.id} className="hover:bg-slate-900/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-200">{key.name}</td>
                                            <td className="px-4 py-3 font-mono text-slate-400">
                                                {key.key_value.substring(0, 12)}...{key.key_value.substring(key.key_value.length - 4)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-400">
                                                {formatDistanceToNow(new Date(key.created_at), { addSuffix: true })}
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-cyan-400"
                                                    onClick={() => copyToClipboard(key.key_value)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-400 hover:text-red-400"
                                                    onClick={() => deleteKey(key.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
