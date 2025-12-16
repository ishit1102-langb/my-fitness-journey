import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  className?: string;
}

export function StatCard({ title, value, unit, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow",
      className
    )}>
      <div className="absolute top-0 right-0 w-24 h-24 gradient-glow opacity-50" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-bold text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className={cn(
            "mt-2 text-xs font-medium",
            trend >= 0 ? "text-success" : "text-destructive"
          )}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% from yesterday
          </div>
        )}
      </div>
    </div>
  );
}
