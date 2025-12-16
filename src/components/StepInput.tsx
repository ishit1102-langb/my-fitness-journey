import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Footprints } from "lucide-react";

interface StepInputProps {
  onSubmit: (steps: number) => void;
  currentSteps: number;
}

export function StepInput({ onSubmit, currentSteps }: StepInputProps) {
  const [steps, setSteps] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!steps) return;
    onSubmit(parseInt(steps));
    setSteps("");
  };

  const quickAddOptions = [1000, 2500, 5000];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="w-5 h-5 text-primary" />
          Log Steps
        </CardTitle>
        <CardDescription>Current: {currentSteps.toLocaleString()} steps</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="Enter steps"
              min="1"
            />
          </div>
          <div className="flex gap-2">
            {quickAddOptions.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSubmit(amount)}
                className="flex-1"
              >
                +{amount.toLocaleString()}
              </Button>
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={!steps}>
            Add Steps
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
