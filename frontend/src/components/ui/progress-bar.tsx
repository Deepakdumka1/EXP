import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  gradient?: boolean;
}

export function ProgressBar({ value, max = 100, className, gradient = false }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn("w-full h-1.5 rounded-full bg-[var(--muted)] overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
