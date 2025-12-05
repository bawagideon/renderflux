'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/lib/supabase';

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({ full_name: '', company_name: '', vat_number: '' });
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Fetch profile
                const { data } = await supabase
                    .from('profiles')
                    .select('full_name, company_name, vat_number')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        company_name: data.company_name || '',
                        vat_number: data.vat_number || ''
                    });
                }
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update(profile)
                .eq('id', user.id);

            if (error) throw error;
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
                <p className="text-slate-400">Manage your account and company settings.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-md mb-4 ${message.includes('successfully') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {message}
                </div>
            )}

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-100">Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="bg-slate-950 border-slate-800 opacity-50"
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 px-6 py-4">
                    <Button onClick={handleSave} disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-100">Company Details</CardTitle>
                    <CardDescription>Manage your company information for invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                            id="company"
                            placeholder="Acme Inc."
                            value={profile.company_name}
                            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vat">VAT Number</Label>
                        <Input
                            id="vat"
                            placeholder="EU123456789"
                            value={profile.vat_number}
                            onChange={(e) => setProfile({ ...profile, vat_number: e.target.value })}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 px-6 py-4">
                    <Button onClick={handleSave} disabled={loading} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>

            <Card className="bg-slate-900 border-slate-800 opacity-50">
                <CardHeader>
                    <CardTitle className="text-slate-100">Security</CardTitle>
                    <CardDescription>Change your password (Disabled for Demo).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" disabled className="bg-slate-950 border-slate-800" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" disabled className="bg-slate-950 border-slate-800" />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 px-6 py-4">
                    <Button disabled>Update Password</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
