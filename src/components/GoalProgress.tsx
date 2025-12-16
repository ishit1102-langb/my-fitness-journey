import { cn } from "@/lib/utils";

interface GoalProgressProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
  className?: string;
}

export function GoalProgress({ label, current, target, unit = "", className }: GoalProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">
          {current.toLocaleString()}/{target.toLocaleString()} {unit}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out progress-animate",
            isComplete ? "bg-success" : "gradient-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(percentage)}% complete</span>
        {isComplete && (
          <span className="text-success font-medium">🎯 Goal reached!</span>
        )}
      </div>
    </div>
  );
}
