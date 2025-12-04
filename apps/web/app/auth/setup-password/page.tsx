'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { ShieldCheck } from 'lucide-react';

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
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] -z-10" />

            <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-4 pt-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-slate-700 shadow-inner">
                        <ShieldCheck className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold text-white">
                            Welcome to RenderFlux
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            Secure your account with a password to continue.
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-5 pb-8">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="bg-slate-950/50 border-slate-700 focus:border-cyan-500 h-11"
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
                            className="bg-slate-950/50 border-slate-700 focus:border-cyan-500 h-11"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full h-11 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all mt-2"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? 'Securing Account...' : 'Set Password & Continue'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}