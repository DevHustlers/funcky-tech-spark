import { Trophy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const MOCK_CHALLENGE_CHART = [
  { name: "Active", value: 14, color: "#10b981" },
  { name: "Ended", value: 8, color: "#6b7280" },
  { name: "Upcoming", value: 5, color: "#f59e0b" },
];

export const ChallengeStatusPie = () => {
  return (
    <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
          Challenge Status
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <Trophy className="w-4 h-4" />
        </div>
      </div>
      <div className="p-2 sm:p-3 h-[160px] sm:h-[200px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={MOCK_CHALLENGE_CHART}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={4}
              dataKey="value"
            >
              {MOCK_CHALLENGE_CHART.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="px-2 sm:px-4 pb-2 sm:pb-3 flex flex-wrap justify-center gap-2 sm:gap-4">
        {MOCK_CHALLENGE_CHART.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 sm:gap-2">
            <div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
