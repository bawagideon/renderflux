'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function LogsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Logs</h1>
                <p className="text-slate-400">View your API request logs.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Requests</CardTitle>
                    <CardDescription>Real-time logs of your PDF generation requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-slate-500">
                        No logs available yet. Make a request to see it here.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
