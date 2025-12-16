import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LogOut, Footprints, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { GoalProgress } from "@/components/GoalProgress";
import { StreakCounter } from "@/components/StreakCounter";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WeeklyChart } from "@/components/WeeklyChart";
import { RecentActivity } from "@/components/RecentActivity";
import { GoalSetting } from "@/components/GoalSetting";
import { StepInput } from "@/components/StepInput";
import { toast } from "@/hooks/use-toast";

interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  timestamp: Date;
}

// Mock weekly data
const mockWeeklyData = [
  { day: "Mon", calories: 320, minutes: 45 },
  { day: "Tue", calories: 450, minutes: 60 },
  { day: "Wed", calories: 280, minutes: 35 },
  { day: "Thu", calories: 520, minutes: 75 },
  { day: "Fri", calories: 380, minutes: 50 },
  { day: "Sat", calories: 600, minutes: 90 },
  { day: "Sun", calories: 0, minutes: 0 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [steps, setSteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const [calorieGoal, setCalorieGoal] = useState(500);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [streak, setStreak] = useState(5);

  useEffect(() => {
    const userData = localStorage.getItem("fittrack_user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(userData));

    // Load saved data
    const savedSteps = localStorage.getItem("fittrack_steps");
    const savedWorkouts = localStorage.getItem("fittrack_workouts");
    const savedGoals = localStorage.getItem("fittrack_goals");

    if (savedSteps) setSteps(parseInt(savedSteps));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      setStepGoal(goals.stepGoal);
      setCalorieGoal(goals.calorieGoal);
    }
  }, [navigate]);

  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  const handleLogout = () => {
    localStorage.removeItem("fittrack_user");
    navigate("/auth");
  };

  const handleAddWorkout = (workout: { type: string; duration: number; calories: number }) => {
    const newWorkout: Workout = {
      id: Date.now().toString(),
      ...workout,
      timestamp: new Date(),
    };
    const updated = [...workouts, newWorkout];
    setWorkouts(updated);
    localStorage.setItem("fittrack_workouts", JSON.stringify(updated));
    toast({
      title: "Workout logged!",
      description: `${workout.type} - ${workout.duration} min, ${workout.calories} kcal`,
    });
  };

  const handleAddSteps = (newSteps: number) => {
    const updated = steps + newSteps;
    setSteps(updated);
    localStorage.setItem("fittrack_steps", updated.toString());
    toast({
      title: "Steps added!",
      description: `+${newSteps.toLocaleString()} steps`,
    });
  };

  const handleUpdateGoals = (newStepGoal: number, newCalorieGoal: number) => {
    setStepGoal(newStepGoal);
    setCalorieGoal(newCalorieGoal);
    localStorage.setItem("fittrack_goals", JSON.stringify({ stepGoal: newStepGoal, calorieGoal: newCalorieGoal }));
    toast({
      title: "Goals updated!",
      description: `Steps: ${newStepGoal.toLocaleString()}, Calories: ${newCalorieGoal}`,
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hey, {user.name}! 👋
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6 relative">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Today's Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <StatCard
            title="Steps"
            value={steps.toLocaleString()}
            icon={<Footprints className="w-5 h-5" />}
            trend={12}
          />
          <StatCard
            title="Calories"
            value={totalCalories}
            unit="kcal"
            icon={<Flame className="w-5 h-5" />}
            trend={8}
          />
          <StatCard
            title="Workout Time"
            value={totalMinutes}
            unit="min"
            icon={<Clock className="w-5 h-5" />}
            trend={-5}
          />
          <StreakCounter streak={streak} />
        </div>

        {/* Goals Section */}
        <div className="grid sm:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <GoalProgress label="Daily Steps" current={steps} target={stepGoal} unit="steps" />
          <GoalProgress label="Calories Burned" current={totalCalories} target={calorieGoal} unit="kcal" />
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <WeeklyChart data={mockWeeklyData} />
            <RecentActivity workouts={workouts} />
          </div>

          {/* Right Column - Forms */}
          <div className="space-y-6 animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
            <WorkoutForm onSubmit={handleAddWorkout} />
            <StepInput onSubmit={handleAddSteps} currentSteps={steps} />
            <GoalSetting
              currentStepGoal={stepGoal}
              currentCalorieGoal={calorieGoal}
              onSave={handleUpdateGoals}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
