import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target } from "lucide-react";

interface GoalSettingProps {
  currentStepGoal: number;
  currentCalorieGoal: number;
  onSave: (stepGoal: number, calorieGoal: number) => void;
}

export function GoalSetting({ currentStepGoal, currentCalorieGoal, onSave }: GoalSettingProps) {
  const [stepGoal, setStepGoal] = useState(currentStepGoal.toString());
  const [calorieGoal, setCalorieGoal] = useState(currentCalorieGoal.toString());

  const handleSave = () => {
    onSave(parseInt(stepGoal) || 10000, parseInt(calorieGoal) || 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Daily Goals
        </CardTitle>
        <CardDescription>Set your daily fitness targets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Daily Step Goal</label>
          <Input
            type="number"
            value={stepGoal}
            onChange={(e) => setStepGoal(e.target.value)}
            placeholder="10000"
            min="1000"
            max="50000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Daily Calorie Goal</label>
          <Input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            placeholder="500"
            min="100"
            max="5000"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Update Goals
        </Button>
      </CardContent>
    </Card>
  );
}
