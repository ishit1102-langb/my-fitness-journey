import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export function StreakCounter({ streak, className }: StreakCounterProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card",
      className
    )}>
      <div className="relative">
        <div className="p-3 rounded-xl bg-warning/10">
          <Flame className="w-6 h-6 text-warning" />
        </div>
        {streak > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-warning flex items-center justify-center">
            <span className="text-[10px] font-bold text-warning-foreground">🔥</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-foreground">{streak} days</div>
        <div className="text-sm text-muted-foreground">Current streak</div>
      </div>
    </div>
  );
}
