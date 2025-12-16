import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  timestamp: Date;
}

interface RecentActivityProps {
  workouts: Workout[];
  className?: string;
}

export function RecentActivity({ workouts, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Today's Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {workouts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No workouts logged today</p>
            <p className="text-sm mt-1">Start by logging your first workout!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Flame className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{workout.type}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {workout.duration} min
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">{workout.calories}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
