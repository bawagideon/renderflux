'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Billing</h1>
                <p className="text-slate-400">Manage your subscription and payment methods.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Current Plan</CardTitle>
                            <CardDescription>You are currently on the Free plan.</CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-sm px-3 py-1">Free Tier</Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-slate-100">$0.00 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                        <Button className="bg-cyan-500 hover:bg-cyan-400 text-slate-950">Upgrade Plan</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>View your past invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500">
                        No invoices found.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
