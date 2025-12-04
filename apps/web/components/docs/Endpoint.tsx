import { Badge } from '@/components/ui/Badge';

interface EndpointProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
}

export function Endpoint({ method, path }: EndpointProps) {
    const methodColors = {
        GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        POST: 'bg-green-500/10 text-green-400 border-green-500/20',
        PUT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
        <div className="flex items-center gap-3 font-mono text-sm my-4 p-3 rounded-md bg-slate-900/50 border border-slate-800">
            <Badge variant="outline" className={`${methodColors[method]} border px-2 py-0.5`}>
                {method}
            </Badge>
            <span className="text-slate-300">{path}</span>
        </div>
    );
}
