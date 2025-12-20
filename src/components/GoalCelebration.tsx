import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GoalCelebrationProps {
  show: boolean;
  goalType: string;
  onClose: () => void;
}

export function GoalCelebration({ show, goalType, onClose }: GoalCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none",
        isVisible ? "animate-fade-in" : "animate-fade-out"
      )}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'][i % 5],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
          />
        ))}
      </div>

      {/* Celebration card */}
      <div className={cn(
        "relative bg-card border border-border rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4",
        "animate-scale-in"
      )}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Goal Achieved!
        </h2>
        <p className="text-muted-foreground">
          You've crushed your <span className="text-primary font-medium">{goalType}</span> goal!
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-4xl">🏆</span>
          <span className="text-4xl">⭐</span>
          <span className="text-4xl">🔥</span>
        </div>
      </div>
    </div>
  );
}
