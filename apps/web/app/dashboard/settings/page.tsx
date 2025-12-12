'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createClient } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        company_name: '',
        vat_number: ''
    });

    // 1. Fetch Profile on Mount
    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch existing profile data
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    email: user.email || '', // Email comes from Auth, not necessarily profile table
                    company_name: data.company_name || '',
                    vat_number: data.vat_number || ''
                });
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    // 2. Save Changes
    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: profile.full_name,
                company_name: profile.company_name,
                vat_number: profile.vat_number
            })
            .eq('id', user.id);

        setSaving(false);
        if (error) {
            alert('Error saving profile');
        } else {
            alert('Settings saved successfully!');
        }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading settings...</div>;

    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Settings</h1>
                <p className="text-slate-400">Manage your account and company settings.</p>
            </div>

            {/* Profile Section */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="bg-slate-950 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-slate-950/50 border-slate-800 text-slate-500 cursor-not-allowed"
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 px-6 py-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-cyan-600 hover:bg-cyan-500">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>

            {/* Company Section */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Company Details</CardTitle>
                    <CardDescription>Manage your company information for invoices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                            id="company"
                            value={profile.company_name}
                            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                            className="bg-slate-950 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vat">VAT Number</Label>
                        <Input
                            id="vat"
                            value={profile.vat_number}
                            onChange={(e) => setProfile({ ...profile, vat_number: e.target.value })}
                            className="bg-slate-950 border-slate-700"
                        />
                    </div>
                </CardContent>
                <CardFooter className="border-t border-slate-800 px-6 py-4">
                    <Button onClick={handleSave} disabled={saving} variant="outline" className="border-slate-700">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
