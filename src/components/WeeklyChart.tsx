import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { TrendingUp } from "lucide-react";

interface WeeklyChartProps {
  data: { day: string; calories: number; minutes: number; isToday?: boolean }[];
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
                tick={({ x, y, payload }) => {
                  const entry = data.find(d => d.day === payload.value);
                  const isTodayDay = entry?.isToday;
                  return (
                    <text 
                      x={x} 
                      y={y + 10} 
                      textAnchor="middle" 
                      fill={isTodayDay ? 'hsl(168 80% 50%)' : 'hsl(215 20% 55%)'} 
                      fontSize={12}
                      fontWeight={isTodayDay ? 600 : 400}
                    >
                      {payload.value}
                    </text>
                  );
                }}
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
                formatter={(value: number, name: string) => [`${value} kcal`, 'Calories']}
              />
              <Bar 
                dataKey="calories" 
                radius={[4, 4, 0, 0]}
                name="Calories"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isToday ? 'hsl(168 80% 60%)' : 'hsl(168 80% 50%)'} 
                    stroke={entry.isToday ? 'hsl(168 80% 70%)' : 'none'}
                    strokeWidth={entry.isToday ? 2 : 0}
                  />
                ))}
              </Bar>
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
