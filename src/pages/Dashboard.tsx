// Dashboard with real-time weekly tracking
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, LogOut, Footprints, Flame, Clock } from "lucide-react";
import { startOfWeek, format, addDays, isToday, isSameDay, subDays, startOfDay } from "date-fns";
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

// Function to get current week's days (Monday to Sunday)
const getCurrentWeekDays = () => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      day: format(date, "EEE"),
      isToday: isToday(date),
    };
  });
};

// Function to calculate weekly chart data from workouts
const getWeeklyChartData = (workouts: Workout[]) => {
  const weekDays = getCurrentWeekDays();
  
  return weekDays.map(({ date, day, isToday: isTodayFlag }) => {
    const dayWorkouts = workouts.filter(w => 
      isSameDay(new Date(w.timestamp), date)
    );
    
    return {
      day,
      calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      minutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      isToday: isTodayFlag,
    };
  });
};

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

    // Check for new week and reset if needed
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString();
    const lastWeekStart = localStorage.getItem("fittrack_week_start");
    
    if (lastWeekStart !== currentWeekStart) {
      // New week! Reset workout data and steps
      localStorage.setItem("fittrack_week_start", currentWeekStart);
      localStorage.removeItem("fittrack_workouts");
      localStorage.removeItem("fittrack_steps");
      setWorkouts([]);
      setSteps(0);
    } else {
      // Load saved data for current week
      const savedSteps = localStorage.getItem("fittrack_steps");
      const savedWorkouts = localStorage.getItem("fittrack_workouts");
      if (savedSteps) setSteps(parseInt(savedSteps));
      if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    }

    // Load goals (persist across weeks)
    const savedGoals = localStorage.getItem("fittrack_goals");
    if (savedGoals) {
      const goals = JSON.parse(savedGoals);
      setStepGoal(goals.stepGoal);
      setCalorieGoal(goals.calorieGoal);
    }
  }, [navigate]);

  // Calculate weekly chart data from actual workouts
  const weeklyChartData = useMemo(() => getWeeklyChartData(workouts), [workouts]);

  // Calculate today's stats
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  const todayWorkouts = useMemo(() => 
    workouts.filter(w => isSameDay(new Date(w.timestamp), today)), 
    [workouts, today]
  );
  const yesterdayWorkouts = useMemo(() => 
    workouts.filter(w => isSameDay(new Date(w.timestamp), yesterday)), 
    [workouts, yesterday]
  );

  const todayCalories = todayWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const yesterdayCalories = yesterdayWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const todayMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const yesterdayMinutes = yesterdayWorkouts.reduce((sum, w) => sum + w.duration, 0);

  // Calculate percentage trends (avoid division by zero)
  const calculateTrend = (current: number, previous: number): number | undefined => {
    if (previous === 0 && current === 0) return undefined;
    if (previous === 0) return 100; // 100% increase from nothing
    return Math.round(((current - previous) / previous) * 100);
  };

  // For steps, we need yesterday's steps from localStorage
  const [yesterdaySteps, setYesterdaySteps] = useState(0);
  
  useEffect(() => {
    const savedYesterdaySteps = localStorage.getItem("fittrack_yesterday_steps");
    if (savedYesterdaySteps) setYesterdaySteps(parseInt(savedYesterdaySteps));
    
    // At end of day, save today's steps as yesterday's (check on load)
    const lastStepDate = localStorage.getItem("fittrack_step_date");
    const todayStr = today.toISOString().split('T')[0];
    
    if (lastStepDate && lastStepDate !== todayStr) {
      // It's a new day, move today's steps to yesterday
      const oldTodaySteps = localStorage.getItem("fittrack_steps");
      if (oldTodaySteps) {
        localStorage.setItem("fittrack_yesterday_steps", oldTodaySteps);
        setYesterdaySteps(parseInt(oldTodaySteps));
      }
      localStorage.setItem("fittrack_steps", "0");
      setSteps(0);
    }
    localStorage.setItem("fittrack_step_date", todayStr);
  }, [today]);

  const stepsTrend = calculateTrend(steps, yesterdaySteps);
  const caloriesTrend = calculateTrend(todayCalories, yesterdayCalories);
  const minutesTrend = calculateTrend(todayMinutes, yesterdayMinutes);

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
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
            </div>
            <nav className="hidden sm:flex items-center gap-4">
              <span className="text-sm text-primary font-medium">Dashboard</span>
              <button 
                onClick={() => navigate("/sports")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sports Guide
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
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
            trend={stepsTrend}
          />
          <StatCard
            title="Calories"
            value={todayCalories}
            unit="kcal"
            icon={<Flame className="w-5 h-5" />}
            trend={caloriesTrend}
          />
          <StatCard
            title="Workout Time"
            value={todayMinutes}
            unit="min"
            icon={<Clock className="w-5 h-5" />}
            trend={minutesTrend}
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
            <WeeklyChart data={weeklyChartData} />
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
