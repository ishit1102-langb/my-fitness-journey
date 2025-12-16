import { useParams, Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Clock, Flame, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSportById, iconMap } from "@/data/sportsData";

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function SportDetail() {
  const { sportId } = useParams<{ sportId: string }>();
  const navigate = useNavigate();
  const sport = getSportById(sportId || "");

  if (!sport) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sport not found</h1>
          <Button onClick={() => navigate("/sports")}>Back to Sports Guide</Button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[sport.icon];

  return (
    <div className="min-h-screen bg-background">
      {/* Background glow */}
      <div className="fixed inset-0 gradient-glow pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/sports" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sports Guide
              </Link>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/sports")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sports
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative">
        {/* Sport Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl gradient-primary">
              {IconComponent && <IconComponent className="w-10 h-10 text-primary-foreground" />}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                {sport.name}
              </h1>
              <p className="text-muted-foreground mt-1">{sport.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Warmup Tips */}
          <Card className="lg:col-span-1 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                Warmup Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {sport.warmupTips.map((tip, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Exercises */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Recommended Exercises
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {sport.exercises.map((exercise, index) => (
                <Card key={index} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{exercise.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={difficultyColors[exercise.difficulty]}
                      >
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {exercise.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{exercise.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
