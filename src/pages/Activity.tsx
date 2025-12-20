import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Activity as ActivityIcon, 
  LogOut, 
  Footprints, 
  Flame, 
  Clock, 
  Heart,
  Droplets,
  TrendingUp,
  Calendar,
  BarChart3,
  Zap,
  Moon
} from "lucide-react";
import { 
  startOfWeek, 
  startOfMonth, 
  endOfMonth,
  format, 
  addDays, 
  isToday, 
  isSameDay,
  eachDayOfInterval,
  subDays,
  startOfDay
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  timestamp: Date;
}

interface HealthMetric {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  max?: number;
}

// Generate mock health data
const generateHealthData = () => ({
  heartRate: Math.floor(Math.random() * 20) + 65,
  heartRateMax: Math.floor(Math.random() * 30) + 150,
  heartRateMin: Math.floor(Math.random() * 10) + 55,
  spo2: Math.floor(Math.random() * 3) + 96,
  activeMinutes: Math.floor(Math.random() * 60) + 30,
  sleepHours: Math.floor(Math.random() * 3) + 6,
  hydration: Math.floor(Math.random() * 4) + 4,
  energyLevel: Math.floor(Math.random() * 30) + 70,
});

export default function Activity() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [steps, setSteps] = useState(0);
  const [healthData] = useState(generateHealthData);
  const [activeTab, setActiveTab] = useState("daily");

  useEffect(() => {
    const userData = localStorage.getItem("fittrack_user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    setUser(JSON.parse(userData));

    const savedSteps = localStorage.getItem("fittrack_steps");
    const savedWorkouts = localStorage.getItem("fittrack_workouts");
    if (savedSteps) setSteps(parseInt(savedSteps));
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("fittrack_user");
    navigate("/");
  };

  // Daily data calculations
  const today = startOfDay(new Date());
  const todayWorkouts = useMemo(() => 
    workouts.filter(w => isSameDay(new Date(w.timestamp), today)), 
    [workouts, today]
  );
  const todayCalories = todayWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const todayMinutes = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);

  // Weekly data
  const weeklyData = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.timestamp), date));
      return {
        day: format(date, "EEE"),
        date: format(date, "MMM d"),
        calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
        minutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        steps: isSameDay(date, today) ? steps : Math.floor(Math.random() * 5000) + 3000,
        isToday: isToday(date),
      };
    });
  }, [workouts, steps, today]);

  // Monthly data
  const monthlyData = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(date => {
      const dayWorkouts = workouts.filter(w => isSameDay(new Date(w.timestamp), date));
      return {
        day: format(date, "d"),
        date: format(date, "MMM d"),
        calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0) || Math.floor(Math.random() * 300) + 100,
        minutes: dayWorkouts.reduce((sum, w) => sum + w.duration, 0) || Math.floor(Math.random() * 45) + 15,
        steps: isSameDay(date, today) ? steps : Math.floor(Math.random() * 8000) + 2000,
        isToday: isToday(date),
      };
    });
  }, [workouts, steps, today]);

  // Health metrics
  const healthMetrics: HealthMetric[] = [
    {
      label: "Heart Rate",
      value: healthData.heartRate,
      unit: "bpm",
      icon: <Heart className="w-5 h-5" />,
      color: "hsl(0, 72%, 51%)",
      trend: 2,
    },
    {
      label: "SpO2",
      value: healthData.spo2,
      unit: "%",
      icon: <Droplets className="w-5 h-5" />,
      color: "hsl(199, 89%, 48%)",
      max: 100,
    },
    {
      label: "Active Minutes",
      value: healthData.activeMinutes,
      unit: "min",
      icon: <Zap className="w-5 h-5" />,
      color: "hsl(38, 92%, 50%)",
      trend: 15,
    },
    {
      label: "Sleep",
      value: healthData.sleepHours,
      unit: "hrs",
      icon: <Moon className="w-5 h-5" />,
      color: "hsl(262, 83%, 58%)",
    },
  ];

  // Heart rate data for chart
  const heartRateData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    rate: Math.floor(Math.random() * 30) + 60,
  }));

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <ActivityIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
            </div>
            <nav className="hidden sm:flex items-center gap-4">
              <Link 
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-sm text-primary font-medium">Activity</span>
              <Link 
                to="/sports"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sports Guide
              </Link>
              <Link 
                to="/products"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Products
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              Hey, {user.name}! 👋
            </span>
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full border border-border hover:border-primary transition-colors cursor-pointer bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-medium">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6 relative">
        {/* Page Title */}
        <div className="animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Activity Details
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress across different time periods
          </p>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {healthMetrics.map((metric, index) => (
            <Card key={metric.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-sm">{metric.label}</span>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                    <span style={{ color: metric.color }}>{metric.icon}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                {metric.trend !== undefined && (
                  <div className={`flex items-center gap-1 mt-2 text-xs ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <TrendingUp className="w-3 h-3" />
                    {metric.trend >= 0 ? '+' : ''}{metric.trend}% from yesterday
                  </div>
                )}
                {metric.max && (
                  <Progress value={(metric.value / metric.max) * 100} className="mt-2 h-1" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Time Period Tabs */}
        <Tabs defaultValue="daily" className="animate-fade-in" style={{ animationDelay: "0.2s" }} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Monthly
            </TabsTrigger>
          </TabsList>

          {/* Daily View */}
          <TabsContent value="daily" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today's Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-secondary/50">
                      <Footprints className="w-6 h-6 mx-auto text-primary mb-2" />
                      <p className="text-2xl font-bold text-foreground">{steps.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Steps</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/50">
                      <Flame className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                      <p className="text-2xl font-bold text-foreground">{todayCalories}</p>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-secondary/50">
                      <Clock className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-2xl font-bold text-foreground">{todayMinutes}</p>
                      <p className="text-xs text-muted-foreground">Minutes</p>
                    </div>
                  </div>

                  {/* Hourly Activity */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">Activity Distribution</h4>
                    <div className="flex gap-1 h-16">
                      {Array.from({ length: 24 }, (_, i) => {
                        const activity = Math.random();
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                              height: `${activity * 100}%`,
                              backgroundColor: activity > 0.5 ? 'hsl(168, 80%, 50%)' : 'hsl(222, 30%, 18%)',
                              alignSelf: 'flex-end'
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>12AM</span>
                      <span>6AM</span>
                      <span>12PM</span>
                      <span>6PM</span>
                      <span>12AM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Heart Rate Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Heart Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={heartRateData}>
                        <defs>
                          <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="hour" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                          interval={5}
                        />
                        <YAxis 
                          domain={[40, 120]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 47%, 9%)',
                            border: '1px solid hsl(222, 30%, 18%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)'
                          }}
                          formatter={(value: number) => [`${value} bpm`, 'Heart Rate']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="hsl(0, 72%, 51%)"
                          fill="url(#heartRateGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around mt-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Min</p>
                      <p className="text-foreground font-medium">{healthData.heartRateMin} bpm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Avg</p>
                      <p className="text-foreground font-medium">{healthData.heartRate} bpm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Max</p>
                      <p className="text-foreground font-medium">{healthData.heartRateMax} bpm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weekly View */}
          <TabsContent value="weekly" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Steps Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-primary" />
                    Weekly Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 47%, 9%)',
                            border: '1px solid hsl(222, 30%, 18%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)'
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} steps`, 'Steps']}
                        />
                        <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
                          {weeklyData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.isToday ? 'hsl(168, 80%, 60%)' : 'hsl(168, 80%, 50%)'} 
                              stroke={entry.isToday ? 'hsl(168, 80%, 70%)' : 'none'}
                              strokeWidth={entry.isToday ? 2 : 0}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-muted-foreground text-sm">Weekly Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {weeklyData.reduce((sum, d) => sum + d.steps, 0).toLocaleString()} steps
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Calories Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Weekly Calories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 47%, 9%)',
                            border: '1px solid hsl(222, 30%, 18%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)'
                          }}
                          formatter={(value: number) => [`${value} kcal`, 'Calories']}
                        />
                        <Bar dataKey="calories" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-muted-foreground text-sm">Weekly Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {weeklyData.reduce((sum, d) => sum + d.calories, 0).toLocaleString()} kcal
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Workout Time Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Weekly Workout Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={weeklyData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 47%, 9%)',
                            border: '1px solid hsl(222, 30%, 18%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)'
                          }}
                          formatter={(value: number) => [`${value} min`, 'Workout Time']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="minutes" 
                          stroke="hsl(199, 89%, 48%)" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(199, 89%, 48%)', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-muted-foreground text-sm">Weekly Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {weeklyData.reduce((sum, d) => sum + d.minutes, 0)} minutes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Monthly View */}
          <TabsContent value="monthly" className="space-y-6 mt-6">
            <div className="grid gap-6">
              {/* Monthly Overview Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5">
                  <CardContent className="p-6 text-center">
                    <Footprints className="w-8 h-8 mx-auto text-primary mb-2" />
                    <p className="text-3xl font-bold text-foreground">
                      {monthlyData.reduce((sum, d) => sum + d.steps, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Steps</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5">
                  <CardContent className="p-6 text-center">
                    <Flame className="w-8 h-8 mx-auto text-orange-500 mb-2" />
                    <p className="text-3xl font-bold text-foreground">
                      {monthlyData.reduce((sum, d) => sum + d.calories, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Calories</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <p className="text-3xl font-bold text-foreground">
                      {Math.round(monthlyData.reduce((sum, d) => sum + d.minutes, 0) / 60)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Steps Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {format(new Date(), "MMMM")} Steps Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(168, 80%, 50%)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(168, 80%, 50%)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                          interval={4}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 47%, 9%)',
                            border: '1px solid hsl(222, 30%, 18%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)'
                          }}
                          labelFormatter={(value, payload) => {
                            const item = payload?.[0]?.payload;
                            return item?.date || value;
                          }}
                          formatter={(value: number) => [`${value.toLocaleString()} steps`, 'Steps']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="steps" 
                          stroke="hsl(168, 80%, 50%)"
                          fill="url(#stepsGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around mt-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Daily Average</p>
                      <p className="text-foreground font-medium">
                        {Math.round(monthlyData.reduce((sum, d) => sum + d.steps, 0) / monthlyData.length).toLocaleString()} steps
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Best Day</p>
                      <p className="text-foreground font-medium">
                        {Math.max(...monthlyData.map(d => d.steps)).toLocaleString()} steps
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Calories Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    {format(new Date(), "MMMM")} Calories Burned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                          interval={4}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(222, 47%, 9%)',
                            border: '1px solid hsl(222, 30%, 18%)',
                            borderRadius: '8px',
                            color: 'hsl(210, 40%, 98%)'
                          }}
                          labelFormatter={(value, payload) => {
                            const item = payload?.[0]?.payload;
                            return item?.date || value;
                          }}
                          formatter={(value: number) => [`${value} kcal`, 'Calories']}
                        />
                        <Bar dataKey="calories" fill="hsl(38, 92%, 50%)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
