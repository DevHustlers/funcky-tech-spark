import { useState } from "react";
import {
  Users,
  Trophy,
  Zap,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  ArrowRight,
  Star,
  Target,
  Flame,
  MessageSquare,
  Github,
  Youtube,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface PointAward {
  id: string;
  user: string;
  action: string;
  points: string;
  time: string;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  status: "draft" | "upcoming" | "live" | "ended" | "scheduled";
}

interface ChallengeData {
  id: string;
  title: string;
  participants: number;
  status: "draft" | "upcoming" | "live" | "ended";
}

const MOCK_EVENTS: EventData[] = [
  {
    id: "ev-1",
    title: "Frontend Hackathon 2026",
    date: "Mar 15, 2026",
    status: "upcoming",
  },
  {
    id: "ev-2",
    title: "AI Workshop: Building LLMs",
    date: "Mar 22, 2026",
    status: "upcoming",
  },
  {
    id: "ev-3",
    title: "Monthly Challenge Reset",
    date: "Apr 1, 2026",
    status: "scheduled",
  },
  {
    id: "ev-4",
    title: "Cybersecurity CTF Tournament",
    date: "Apr 10, 2026",
    status: "draft",
  },
  {
    id: "ev-5",
    title: "Community Meetup #15",
    date: "Apr 15, 2026",
    status: "draft",
  },
  {
    id: "ev-6",
    title: "DevOps Summit 2026",
    date: "Apr 20, 2026",
    status: "draft",
  },
  {
    id: "ev-7",
    title: "Mobile App Challenge",
    date: "Apr 25, 2026",
    status: "draft",
  },
];

const MOCK_POINT_LOG: PointAward[] = [
  {
    id: "pl-1",
    user: "Sarah Chen",
    action: "Completed challenge",
    points: "+500",
    time: "10m ago",
  },
  {
    id: "pl-2",
    user: "Ahmed Hassan",
    action: "Followed Discord",
    points: "+50",
    time: "25m ago",
  },
  {
    id: "pl-3",
    user: "Maria Rodriguez",
    action: "Daily login streak (12d)",
    points: "+120",
    time: "1h ago",
  },
  {
    id: "pl-4",
    user: "James Park",
    action: "Referral bonus",
    points: "+200",
    time: "2h ago",
  },
  {
    id: "pl-5",
    user: "Fatima Al-Sayed",
    action: "Manual award (Admin)",
    points: "+300",
    time: "3h ago",
  },
  {
    id: "pl-6",
    user: "Omar Mostafa",
    action: "Completed challenge",
    points: "+750",
    time: "4h ago",
  },
  {
    id: "pl-7",
    user: "Lisa Wang",
    action: "Bug bounty reward",
    points: "+1000",
    time: "5h ago",
  },
  {
    id: "pl-8",
    user: "John Smith",
    action: "Daily login",
    points: "+10",
    time: "6h ago",
  },
  {
    id: "pl-9",
    user: "Emma Wilson",
    action: "Completed challenge",
    points: "+600",
    time: "7h ago",
  },
  {
    id: "pl-10",
    user: "Michael Brown",
    action: "Followed GitHub",
    points: "+40",
    time: "8h ago",
  },
  {
    id: "pl-11",
    user: "Sofia Garcia",
    action: "Weekly streak bonus",
    points: "+150",
    time: "9h ago",
  },
  {
    id: "pl-12",
    user: "David Lee",
    action: "First challenge completion",
    points: "+250",
    time: "10h ago",
  },
];

const MOCK_CHALLENGES: ChallengeData[] = [
  {
    id: "ch-1",
    title: "Build a Real-Time Chat UI",
    participants: 128,
    status: "live",
  },
  {
    id: "ch-2",
    title: "REST API Rate Limiter",
    participants: 89,
    status: "live",
  },
  {
    id: "ch-3",
    title: "Neural Network from Scratch",
    participants: 45,
    status: "live",
  },
  {
    id: "ch-4",
    title: "XSS Detection Scanner",
    participants: 67,
    status: "ended",
  },
  {
    id: "ch-5",
    title: "Predictive Analytics Dashboard",
    participants: 0,
    status: "upcoming",
  },
  {
    id: "ch-6",
    title: "Kubernetes Cluster Setup",
    participants: 34,
    status: "live",
  },
  {
    id: "ch-7",
    title: "GraphQL API Design",
    participants: 52,
    status: "ended",
  },
];

const MOCK_STATS = [
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

const MOCK_CHANNELS = [
  {
    name: "Discord",
    followers: 1842,
    icon: MessageSquare,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    name: "GitHub",
    followers: 2156,
    icon: Github,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
  },
  {
    name: "YouTube",
    followers: 1567,
    icon: Youtube,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Community",
    followers: 987,
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const MOCK_ACTIVITY_CHART = [
  { date: "Mon", points: 2400, users: 120 },
  { date: "Tue", points: 1398, users: 98 },
  { date: "Wed", points: 9800, users: 210 },
  { date: "Thu", points: 3908, users: 145 },
  { date: "Fri", points: 4800, users: 180 },
  { date: "Sat", points: 3800, users: 160 },
  { date: "Sun", points: 4300, users: 175 },
];

const MOCK_CHALLENGE_CHART = [
  { name: "Active", value: 14, color: "#10b981" },
  { name: "Ended", value: 8, color: "#6b7280" },
  { name: "Upcoming", value: 5, color: "#f59e0b" },
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    inactive: "text-muted-foreground border-border bg-muted/10",
    banned: "text-red-500 border-red-500/30 bg-red-500/10",
    live: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
    upcoming: "text-amber-500 border-amber-500/30 bg-amber-500/10",
    ended: "text-muted-foreground border-border bg-muted/10",
    scheduled: "text-blue-500 border-blue-500/30 bg-blue-500/10",
    draft: "text-muted-foreground border-border bg-muted/10",
  };
  return map[status] || "text-muted-foreground border-border bg-muted/10";
};

export default function Overview() {
  const [events] = useState<EventData[]>(MOCK_EVENTS);
  const [pointLog] = useState<PointAward[]>(MOCK_POINT_LOG);

  return (
    <PageTransition>
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <linearGradient
                      id="colorPoints"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
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
                <div
                  key={item.name}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
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

          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                Upcoming Timeline
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="relative">
                <div className="absolute start-3 top-0 bottom-0 w-px bg-border rtl:start-auto rtl:end-3 group-hover:bg-primary/20 transition-colors duration-300" />
                {events.slice(0, 4).map((event) => (
                  <div
                    key={event.id}
                    className="relative ps-6 sm:ps-8 pb-3 sm:pb-4 last:pb-0 group/event hover:ps-7 sm:hover:ps-9 transition-all duration-200"
                  >
                    <div
                      className={`absolute start-[9px] sm:start-[11px] top-2 w-2 h-2 rounded-full border-2 border-background rtl:start-auto group-hover/event:scale-150 group-hover/event:shadow-lg group-hover/event:shadow-current transition-all duration-300 ${
                        event.status === "live"
                          ? "bg-emerald-500"
                          : event.status === "upcoming"
                            ? "bg-amber-500"
                            : event.status === "scheduled"
                              ? "bg-blue-500"
                              : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/event:text-primary transition-colors">
                          {event.title}
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono group-hover/event:text-foreground/70 transition-colors">
                          {event.date}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider shrink-0 group-hover/event:border-primary/50 transition-colors ${statusBadge(event.status)}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
              <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
                View all events{" "}
                <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                Recent Points Activity
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="divide-y divide-border last:rounded-b-2xl">
              {pointLog.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 hover:ps-6 sm:hover:ps-7 transition-all duration-200 group/item cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-accent border border-border rounded-xl flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono text-foreground group-hover/item:scale-110 group-hover/item:border-primary/30 transition-all duration-200">
                      {log.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/item:text-primary transition-colors">
                        {log.user}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 group-hover/item:text-foreground/70 transition-colors">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                        {log.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-[12px] sm:text-[14px] font-mono font-bold text-emerald-500 group-hover/item:text-emerald-400 transition-colors">
                      {log.points}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono group-hover/item:text-foreground/60 transition-colors">
                      {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
              <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
                View all activity{" "}
                <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                Top Challenges
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="divide-y divide-border last:rounded-b-2xl">
              {MOCK_CHALLENGES.slice(0, 4).map((challenge, idx) => (
                <div
                  key={challenge.id}
                  className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 hover:ps-6 sm:hover:ps-6 transition-all duration-200 group/challenge cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono shrink-0 rounded-lg group-hover/challenge:scale-110 transition-transform duration-200 ${
                        idx === 0
                          ? "bg-amber-500/20 text-amber-500"
                          : idx === 1
                            ? "bg-slate-400/20 text-slate-400"
                            : idx === 2
                              ? "bg-orange-600/20 text-orange-600"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/challenge:text-primary transition-colors">
                        {challenge.title}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 group-hover/challenge:text-foreground/70 transition-colors">
                        <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />{" "}
                        {challenge.participants} participants
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider shrink-0 ${statusBadge(challenge.status)}`}
                  >
                    {challenge.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
              <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
                View all challenges{" "}
                <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                Leaderboard
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="divide-y divide-border last:rounded-b-2xl">
              {[
                { name: "Sarah Chen", points: 12450, streak: 12 },
                { name: "Ahmed Hassan", points: 11200, streak: 8 },
                { name: "Maria Rodriguez", points: 10800, streak: 5 },
                { name: "James Park", points: 9650, streak: 3 },
              ].map((user, idx) => (
                <div
                  key={idx}
                  className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 hover:ps-6 sm:hover:ps-6 transition-all duration-200 group/user cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent border border-border flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono text-foreground shrink-0 rounded-lg group-hover/user:scale-110 group-hover/user:border-primary/30 transition-all duration-200">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/user:text-primary transition-colors">
                        {user.name}
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 group-hover/user:text-foreground/70 transition-colors">
                        <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" />{" "}
                        {user.streak} day streak
                      </p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-foreground text-[12px] sm:text-[14px] shrink-0 group-hover/user:text-primary transition-colors">
                    {user.points.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
              <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
                View all rankings{" "}
                <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
