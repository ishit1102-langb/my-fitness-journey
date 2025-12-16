import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Footprints, Target, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect if logged in
    const user = localStorage.getItem("fittrack_user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const features = [
    {
      icon: <Footprints className="w-6 h-6" />,
      title: "Track Steps",
      description: "Log your daily steps and watch your progress grow"
    },
    {
      icon: <Flame className="w-6 h-6" />,
      title: "Log Workouts",
      description: "Record any workout type with duration and calories"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Set Goals",
      description: "Define daily targets and crush them consistently"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "See Progress",
      description: "Visualize your weekly activity with beautiful charts"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 container py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg gradient-primary shadow-glow">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
          </div>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container">
        <section className="py-16 sm:py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Flame className="w-4 h-4" />
              Simple. Effective. Free.
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Track Your Fitness
              <br />
              <span className="text-gradient">Build Better Habits</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto">
              The simplest way to track your daily activity. Log workouts, count steps, 
              set goals, and build unstoppable streaks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="glow" onClick={() => navigate("/auth")}>
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-glow animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-card animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of people building healthier habits, one day at a time.
            </p>
            <Button size="lg" variant="glow" onClick={() => navigate("/auth")}>
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 FitTrack. Built for fitness enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}
