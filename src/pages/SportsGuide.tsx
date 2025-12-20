import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sportsData, iconMap } from "@/data/sportsData";

export default function SportsGuide() {
  const navigate = useNavigate();

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
                to="/activity" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Activity
              </Link>
              <Link 
                to="/sports" 
                className="text-sm text-primary font-medium"
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
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Sports Training Guide
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Discover sport-specific exercises and warmup routines to improve your performance. 
            Select a sport to get personalized training tips.
          </p>
        </div>

        {/* Sports Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {sportsData.map((sport) => {
            const IconComponent = iconMap[sport.icon];
            return (
              <Link key={sport.id} to={`/sports/${sport.id}`}>
                <Card className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                    </div>
                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {sport.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
