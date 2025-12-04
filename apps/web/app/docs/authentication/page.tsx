'use client';

import { ChevronRight } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function AuthenticationPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Docs</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>Getting Started</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-200">Authentication</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-100">Authentication</h1>
                <p className="text-lg text-slate-400 leading-relaxed">
                    RenderFlux uses API keys to authenticate requests. You can view and manage your API keys in the Dashboard.
                </p>
            </div>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Bearer Token</h2>
                <p className="text-slate-400">
                    Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
                </p>
                <p className="text-slate-400">
                    Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password.
                </p>
                <CodeBlock
                    code={`Authorization: Bearer sk_live_51Mz...`}
                    language="http"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-100">Handling Errors</h2>
                <p className="text-slate-400">
                    If you provide an invalid API key, or if your key has been revoked, the API will return a <code className="text-red-400 bg-red-900/20 px-1 rounded">401 Unauthorized</code> error.
                </p>
                <CodeBlock
                    code={`{
  "error": {
    "code": "unauthorized",
    "message": "Invalid API Key provided."
  }
}`}
                    language="json"
                />
            </section>
        </div>
    );
}
