import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate auth - replace with real auth when Cloud is connected
    setTimeout(() => {
      localStorage.setItem("fittrack_user", JSON.stringify({ email, name: name || email.split("@")[0] }));
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: "Redirecting to your dashboard...",
      });
      navigate("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />
      
      <div className="relative w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl gradient-primary shadow-glow mb-4">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">FitTrack</h1>
          <p className="text-muted-foreground mt-2">Your daily fitness companion</p>
        </div>

        {/* Auth Card */}
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Sign in to continue tracking" : "Start your fitness journey"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: "Track Workouts", icon: "🏃" },
            { label: "Set Goals", icon: "🎯" },
            { label: "Build Streaks", icon: "🔥" },
          ].map((feature) => (
            <div key={feature.label} className="p-3 rounded-lg bg-card/50 border border-border/50">
              <div className="text-2xl mb-1">{feature.icon}</div>
              <div className="text-xs text-muted-foreground">{feature.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
