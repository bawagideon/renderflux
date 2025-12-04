'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { Lock } from 'lucide-react';

export default function SetupPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleUpdate = async () => {
        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Success! Now go to dashboard
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-center">
                <CardHeader className="space-y-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                        <Lock className="h-6 w-6 text-purple-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-100">
                        Welcome to RenderFlux!
                    </CardTitle>
                    <CardDescription className="text-base">
                        Set your password to secure your account and continue.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm">Confirm Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold mt-4"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? 'Setting Password...' : 'Set my password'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}