'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg border border-slate-800 bg-[#0B1120] overflow-hidden my-4">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                <span className="text-xs font-medium text-slate-400 uppercase">{language}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-slate-500 hover:text-slate-300"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-slate-300 leading-relaxed">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}
