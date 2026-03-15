import { TrendingUp, Users, Trophy, Zap, Calendar, Star, Target, LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
}

const MOCK_STATS: StatItem[] = [
  {
    label: "Total Users",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Active Challenges",
    value: "14",
    change: "+3",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Points Awarded",
    value: "184K",
    change: "+8.2%",
    icon: Zap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Upcoming Events",
    value: "6",
    change: "+2",
    icon: Calendar,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    label: "Active Members",
    value: "1,234",
    change: "+18%",
    icon: Star,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    label: "Avg. Score",
    value: "847",
    change: "+5%",
    icon: Target,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
];

export const StatGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
      {MOCK_STATS.map((stat) => (
        <div
          key={stat.label}
          className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bg} ${stat.border} border rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
            >
              <stat.icon
                className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`}
              />
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
              {stat.change}
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-foreground font-mono group-hover:text-primary transition-colors">
            {stat.value}
          </p>
          <p className="text-[10px] sm:text-[12px] text-muted-foreground mt-0.5 sm:mt-1 group-hover:text-foreground/80 transition-colors">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};
