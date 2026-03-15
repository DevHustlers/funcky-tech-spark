import { Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const MOCK_ACTIVITY_CHART = [
  { date: "Mon", points: 2400, users: 120 },
  { date: "Tue", points: 1398, users: 98 },
  { date: "Wed", points: 9800, users: 210 },
  { date: "Thu", points: 3908, users: 145 },
  { date: "Fri", points: 4800, users: 180 },
  { date: "Sat", points: 3800, users: 160 },
  { date: "Sun", points: 4300, users: 175 },
];

export const WeeklyActivityChart = () => {
  return (
    <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
          Weekly Activity
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Activity className="w-4 h-4" />
        </div>
      </div>
      <div className="p-2 sm:p-3 h-[270px] sm:h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={MOCK_ACTIVITY_CHART}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [value.toLocaleString(), ""]}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke="hsl(var(--chart-1))"
              fillOpacity={1}
              fill="url(#colorPoints)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--chart-2))"
              fillOpacity={1}
              fill="url(#colorUsers)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
