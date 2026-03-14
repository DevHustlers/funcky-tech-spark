import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { ChallengeForm } from "./components/ChallengeForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";

interface ChallengeData {
  id: string;
  title: string;
  description: string;
  track: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  status: "draft" | "upcoming" | "live" | "ended";
  participants: number;
  points: number;
  duration: string;
  requirements: string;
}

const MOCK_CHALLENGES: ChallengeData[] = [
  {
    id: "ch-1",
    title: "Build a Real-Time Chat UI",
    description:
      "Create a responsive chat interface with message bubbles, typing indicators, and emoji support.",
    track: "Frontend",
    difficulty: "Medium",
    status: "live",
    participants: 128,
    points: 500,
    duration: "7 days",
    requirements:
      "Must use WebSocket or SSE for real-time updates. Responsive design required.",
  },
  {
    id: "ch-2",
    title: "REST API Rate Limiter",
    description:
      "Implement a rate limiting middleware that supports multiple strategies.",
    track: "Backend",
    difficulty: "Hard",
    status: "live",
    participants: 89,
    points: 750,
    duration: "5 days",
    requirements: "Support token bucket and sliding window algorithms.",
  },
  {
    id: "ch-3",
    title: "Neural Network from Scratch",
    description: "Build a simple neural network without using ML frameworks.",
    track: "AI / ML",
    difficulty: "Expert",
    status: "live",
    participants: 45,
    points: 1000,
    duration: "14 days",
    requirements:
      "Implement backpropagation, support at least 2 activation functions.",
  },
  {
    id: "ch-4",
    title: "XSS Detection Scanner",
    description: "Create a tool that detects common XSS vulnerabilities.",
    track: "Cybersecurity",
    difficulty: "Hard",
    status: "ended",
    participants: 67,
    points: 800,
    duration: "10 days",
    requirements: "Must detect reflected and stored XSS patterns.",
  },
  {
    id: "ch-5",
    title: "Predictive Analytics Dashboard",
    description:
      "Build a dashboard with interactive charts and predictive models.",
    track: "Data Science",
    difficulty: "Medium",
    status: "upcoming",
    participants: 0,
    points: 600,
    duration: "7 days",
    requirements:
      "Use at least 2 chart types. Include a simple prediction model.",
  },
  {
    id: "ch-6",
    title: "Kubernetes Cluster Setup",
    description:
      "Deploy a production-ready Kubernetes cluster with monitoring.",
    track: "DevOps",
    difficulty: "Hard",
    status: "live",
    participants: 34,
    points: 850,
    duration: "10 days",
    requirements:
      "Include auto-scaling, monitoring with Prometheus, and Helm charts.",
  },
  {
    id: "ch-7",
    title: "React Native E-Commerce App",
    description: "Build a full-featured mobile shopping application.",
    track: "Mobile",
    difficulty: "Medium",
    status: "live",
    participants: 56,
    points: 650,
    duration: "14 days",
    requirements: "Include cart, payments integration, and push notifications.",
  },
  {
    id: "ch-8",
    title: "Smart Contract Audit",
    description: "Audit a sample DeFi smart contract for vulnerabilities.",
    track: "Blockchain",
    difficulty: "Expert",
    status: "draft",
    participants: 0,
    points: 1200,
    duration: "21 days",
    requirements: "Find and document all security vulnerabilities.",
  },
  {
    id: "ch-9",
    title: "GraphQL API Design",
    description: "Design and implement a GraphQL API for a blogging platform.",
    track: "Backend",
    difficulty: "Medium",
    status: "ended",
    participants: 52,
    points: 550,
    duration: "7 days",
    requirements:
      "Implement CRUD operations, subscriptions, and authentication.",
  },
  {
    id: "ch-10",
    title: "Unity 3D Platformer",
    description: "Create a 3D platformer game with Unity engine.",
    track: "Game Dev",
    difficulty: "Hard",
    status: "draft",
    participants: 0,
    points: 900,
    duration: "30 days",
    requirements: "Include level design, physics, and character controller.",
  },
];

const TRACK_OPTIONS = [
  "Frontend",
  "Backend",
  "AI / ML",
  "Cybersecurity",
  "Data Science",
  "DevOps",
  "Mobile",
  "Full Stack",
];
const DIFFICULTY_OPTIONS: ChallengeData["difficulty"][] = [
  "Easy",
  "Medium",
  "Hard",
  "Expert",
];

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "text-emerald-500 border-emerald-500/30",
    inactive: "text-muted-foreground border-border",
    banned: "text-red-500 border-red-500/30",
    live: "text-emerald-500 border-emerald-500/30",
    upcoming: "text-amber-500 border-amber-500/30",
    ended: "text-muted-foreground border-border",
    scheduled: "text-blue-500 border-blue-500/30",
    draft: "text-muted-foreground border-border",
  };
  return map[status] || "text-muted-foreground border-border";
};

const difficultyBadge = (d: string) => {
  const map: Record<string, string> = {
    Easy: "text-emerald-500 border-emerald-500/30",
    Medium: "text-amber-500 border-amber-500/30",
    Hard: "text-orange-500 border-orange-500/30",
    Expert: "text-red-500 border-red-500/30",
  };
  return map[d] || "text-muted-foreground border-border";
};

const PrimaryBtn = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
  >
    {children}
  </button>
);

export default function Challenges() {
  const { t } = useLanguage();
  const [challenges, setChallenges] =
    useState<ChallengeData[]>(MOCK_CHALLENGES);
  const [chalFormMode, setChalFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingChal, setEditingChal] = useState<ChallengeData | undefined>();

  const saveChallenge = (chal: ChallengeData) => {
    if (chalFormMode === "edit") {
      setChallenges((prev) => prev.map((c) => (c.id === chal.id ? chal : c)));
    } else {
      setChallenges((prev) => [chal, ...prev]);
    }
    setChalFormMode("none");
    setEditingChal(undefined);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <p className="text-[12px] sm:text-[13px] text-muted-foreground">
            {t("dash.managing")}{" "}
            <span className="text-foreground font-medium">
              {challenges.length}
            </span>{" "}
            {t("dash.active_label")}
          </p>
          <PrimaryBtn
            onClick={() => {
              setChalFormMode("create");
              setEditingChal(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("dash.new_challenge")}</span><span className="sm:hidden">New</span>
          </PrimaryBtn>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {challenges.map((c) => (
            <div
              className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h4 className="text-[13px] sm:text-[14px] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {c.title}
                </h4>
              </div>

              <p className="text-[11px] sm:text-[12px] text-muted-foreground mb-3 sm:mb-4 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                {c.description}
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${statusBadge(c.status)}`}
                >
                  {c.status}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${difficultyBadge(c.difficulty)}`}
                >
                  {c.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground font-mono mb-3 sm:mb-4 group-hover:text-foreground/70 transition-colors">
                <span className="flex items-center gap-1">{c.track}</span>
                <span>{c.participants} pts</span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                    Points
                  </p>
                  <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                    {c.points}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={() => {
                      setChalFormMode("edit");
                      setEditingChal(c);
                    }}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group/btn"
                  >
                    <Pencil className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group/btn">
                    <Eye className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() =>
                      setChallenges((prev) => prev.filter((x) => x.id !== c.id))
                    }
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BottomDrawer
          open={chalFormMode !== "none"}
          onClose={() => {
            setChalFormMode("none");
            setEditingChal(undefined);
          }}
          title={chalFormMode === "edit" ? t("dash.edit_challenge") : t("dash.new_challenge")}
        >
          <ChallengeForm
            initial={editingChal}
            isEdit={chalFormMode === "edit"}
            onSave={saveChallenge}
            onCancel={() => {
              setChalFormMode("none");
              setEditingChal(undefined);
            }}
          />
        </BottomDrawer>
      </div>
    </PageTransition>
  );
}
