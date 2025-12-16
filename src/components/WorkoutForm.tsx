import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface WorkoutFormProps {
  onSubmit: (workout: { type: string; duration: number; calories: number }) => void;
}

const workoutTypes = [
  "Running",
  "Walking",
  "Cycling",
  "Swimming",
  "Weight Training",
  "Yoga",
  "HIIT",
  "Other"
];

export function WorkoutForm({ onSubmit }: WorkoutFormProps) {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !duration) return;
    
    onSubmit({
      type,
      duration: parseInt(duration),
      calories: parseInt(calories) || Math.round(parseInt(duration) * 8)
    });
    
    setType("");
    setDuration("");
    setCalories("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Log Workout
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Workout Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((workout) => (
                  <SelectItem key={workout} value={workout}>
                    {workout}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration (min)</label>
              <Input
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Calories</label>
              <Input
                type="number"
                placeholder="Auto-estimate"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={!type || !duration}>
            Log Workout
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
