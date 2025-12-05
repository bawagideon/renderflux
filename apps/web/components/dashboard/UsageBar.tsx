import { cn } from "@/lib/utils";

interface UsageBarProps {
    used: number;
    total: number;
    label?: string;
    className?: string;
}

export function UsageBar({ used, total, label, className }: UsageBarProps) {
    const percentage = Math.min(100, Math.max(0, (used / total) * 100));

    return (
        <div className={cn("w-full space-y-2", className)}>
            <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-200">{label || `Your usage (${used}/${total})`}</span>
                <span className="text-slate-400">{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                    className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-xs text-slate-500">You used {Math.round(percentage)}% of your free plan.</p>
        </div>
    );
}
