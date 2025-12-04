'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';
import { CheckCircle2, Mail } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleRegister = async () => {
        setLoading(true);
        setError(null);

        // 1. Sign Up with a random temp password (effectively a magic link flow)
        // We do this so we can attach metadata (name) immediately.
        const tempPassword = `mw_${Math.random().toString(36).slice(2)}_${Date.now()}`;

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password: tempPassword,
            options: {
                data: { full_name: name },
                // IMPORTANT: Redirect to our special callback handler
                emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/setup-password`
            }
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
                <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-center p-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <Mail className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-slate-100">Check your email</h2>
                    <p className="mb-6 text-slate-400">
                        We've sent a temporary login link to <span className="font-medium text-slate-200">{email}</span>.
                        <br />Click it to activate your account.
                    </p>
                    <Button variant="outline" onClick={() => setSuccess(false)} className="w-full border-slate-700">
                        Back to Sign In
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-900">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-100">
                        Quickly get started
                    </CardTitle>
                    <CardDescription>
                        Get started under a minute. No credit card required.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create free account'}
                    </Button>
                </CardContent>
                <CardFooter className="justify-center text-sm text-slate-400">
                    Already a member?{' '}
                    <Link href="/login" className="ml-1 text-cyan-500 hover:underline">
                        Login Here
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}