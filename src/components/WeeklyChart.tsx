import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface WeeklyChartProps {
  data: { day: string; calories: number; minutes: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222 47% 9%)',
                  border: '1px solid hsl(222 30% 18%)',
                  borderRadius: '8px',
                  color: 'hsl(210 40% 98%)'
                }}
                labelStyle={{ color: 'hsl(210 40% 98%)' }}
              />
              <Bar 
                dataKey="calories" 
                fill="hsl(168 80% 50%)" 
                radius={[4, 4, 0, 0]}
                name="Calories"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Calories Burned</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
