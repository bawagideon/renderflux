'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleRegister = async () => {
        setLoading(true);
        setError(null);

        // 1. Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            // 2. Create Profile (Trigger handles this automatically in DB, but we can add extra fields if needed later)
            // For now, the trigger handles id and email. We might want to update full_name.

            const { error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', data.user.id);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                // Non-blocking error
            }

            router.push('/dashboard');
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
            <Card className="w-full max-w-md border-slate-800 bg-slate-900">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-100">
                        Quickly get started
                    </CardTitle>
                    <CardDescription>
                        Create an account to start generating PDFs
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Preferred Language</Label>
                        <select
                            id="language"
                            className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-slate-200"
                        >
                            <option value="node">Node.js</option>
                            <option value="python">Python</option>
                            <option value="go">Go</option>
                            <option value="php">PHP</option>
                        </select>
                    </div>
                    <Button
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </CardContent>
                <CardFooter className="justify-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="ml-1 text-cyan-500 hover:underline">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
