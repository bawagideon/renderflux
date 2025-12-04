'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, Download, ExternalLink } from 'lucide-react';

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Billing</h1>
                <p className="text-slate-400">Manage your subscription and billing details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Current Plan */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the <span className="text-cyan-400 font-medium">Pro Plan</span>.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Billing Cycle</span>
                            <span className="text-slate-200">Monthly</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Next Payment</span>
                            <span className="text-slate-200">Jan 1, 2026</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-400">Amount</span>
                            <span className="text-slate-200">$29.00</span>
                        </div>
                        <div className="pt-4">
                            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">Change Plan</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Manage your payment details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-800 bg-slate-950/50">
                            <div className="h-10 w-16 bg-slate-800 rounded flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-200">Visa ending in 4242</p>
                                <p className="text-xs text-slate-500">Expires 12/2028</p>
                            </div>
                            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">Default</Badge>
                        </div>
                        <Button className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950">Update Payment Method</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Invoices */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>View and download your past invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-slate-800 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                                <tr>
                                    <th className="px-4 py-3">Invoice ID</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                                {[
                                    { id: 'INV-2025-001', date: 'Dec 1, 2025', amount: '$29.00', status: 'Paid' },
                                    { id: 'INV-2025-002', date: 'Nov 1, 2025', amount: '$29.00', status: 'Paid' },
                                    { id: 'INV-2025-003', date: 'Oct 1, 2025', amount: '$29.00', status: 'Paid' },
                                ].map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-mono text-slate-300">{invoice.id}</td>
                                        <td className="px-4 py-3 text-slate-400">{invoice.date}</td>
                                        <td className="px-4 py-3 text-slate-200 font-medium">{invoice.amount}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/10">
                                                {invoice.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400">
                                                <Download className="h-4 w-4" />
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
