'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, Check, Download, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { getUserPlan } from '@/lib/api';

export default function BillingPage() {
    const supabase = createClient();
    const [plan, setPlan] = useState<{ plan: string, credits_limit: number }>({ plan: 'hobby', credits_limit: 50 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPlan() {
            setLoading(true);
            try {
                const planData = await getUserPlan(supabase);
                setPlan(planData);
            } catch (error) {
                console.error('Failed to load plan', error);
            } finally {
                setLoading(false);
            }
        }
        loadPlan();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-100 mb-2">Billing & Invoices</h1>
                <p className="text-slate-400">Manage your subscription and payment methods.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Current Plan */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-100">Current Plan</CardTitle>
                        <CardDescription>You are currently on the <span className="text-cyan-400 font-bold capitalize">{plan.plan}</span> plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-100">
                                {plan.plan === 'hobby' ? 'Free' : '$29'}
                            </span>
                            <span className="text-slate-500">/ month</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Credits Limit</span>
                                <span className="text-slate-200">{plan.credits_limit.toLocaleString()} / month</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 w-full opacity-20" /> {/* Just a visual indicator for limit */}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {plan.plan === 'hobby' ? (
                                <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                                    Upgrade to Pro
                                </Button>
                            ) : (
                                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white">
                                    Manage Subscription
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-slate-100">Payment Method</CardTitle>
                        <CardDescription>Manage your billing details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 border border-slate-800 rounded-lg bg-slate-950">
                            <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-400">VISA</span>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-slate-200">•••• •••• •••• 4242</div>
                                <div className="text-xs text-slate-500">Expires 12/2024</div>
                            </div>
                            <Badge variant="outline" className="ml-auto border-green-500/20 text-green-400 bg-green-500/10">Default</Badge>
                        </div>

                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white">
                            Update Payment Method
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices */}
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                    <h3 className="font-bold text-slate-200">Invoices</h3>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">Download All</Button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-400 font-medium border-b border-slate-800 bg-slate-950/50">
                        <tr>
                            <th className="p-4">Invoice ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Download</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {/* Mock invoices for now as Supabase likely doesn't have stripe integration yet */}
                        <tr className="hover:bg-slate-800/30">
                            <td className="p-4 font-mono text-slate-300">INV-2023-001</td>
                            <td className="p-4 text-slate-400">Oct 1, 2023</td>
                            <td className="p-4 text-slate-200">$0.00</td>
                            <td className="p-4">
                                <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10 hover:bg-green-500/20">Paid</Badge>
                            </td>
                            <td className="p-4 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-cyan-400">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
