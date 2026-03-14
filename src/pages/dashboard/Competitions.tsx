import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Copy,
  Calendar,
  Play,
  StopCircle,
  Clock,
  Timer,
  Trophy,
  Users,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { CompetitionForm } from "./components/CompetitionForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";

interface CompetitionQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
}

interface CompetitionData {
  id: string;
  title: string;
  description: string;
  status: "draft" | "scheduled" | "live" | "ended";
  scheduledDate: string;
  timePerQuestion: number;
  prize: string;
  questions: CompetitionQuestion[];
  participants: number;
}

const MOCK_COMPETITIONS: CompetitionData[] = [
  {
    id: "comp-1",
    title: "Frontend Mastery Showdown",
    description: "Test your frontend knowledge in React, CSS, and JavaScript",
    status: "live",
    scheduledDate: "Mar 9, 2026 — 8:00 PM",
    timePerQuestion: 15,
    prize: "500 pts + Gold Badge",
    participants: 128,
    questions: [
      {
        id: 1,
        question: "Which CSS property is used to create a flexible box layout?",
        options: [
          "display: grid",
          "display: flex",
          "display: block",
          "display: inline",
        ],
        correctIndex: 1,
        timeLimit: 15,
      },
      {
        id: 2,
        question: "What does the 'useEffect' hook do in React?",
        options: [
          "Manages state",
          "Creates a component",
          "Performs side effects after render",
          "Optimizes re-renders",
        ],
        correctIndex: 2,
        timeLimit: 15,
      },
    ],
  },
  {
    id: "comp-2",
    title: "Backend Brain Battle",
    description:
      "API and server-side quiz covering Node.js, Express, and databases",
    status: "scheduled",
    scheduledDate: "Mar 15, 2026 — 7:00 PM",
    timePerQuestion: 20,
    prize: "750 pts + Silver Badge",
    participants: 0,
    questions: [
      {
        id: 1,
        question: "Which HTTP method is idempotent?",
        options: ["POST", "PATCH", "PUT", "DELETE"],
        correctIndex: 2,
        timeLimit: 20,
      },
    ],
  },
  {
    id: "comp-3",
    title: "JS Fundamentals Sprint",
    description: "Core JavaScript knowledge including ES6+ features",
    status: "ended",
    scheduledDate: "Mar 1, 2026 — 6:00 PM",
    timePerQuestion: 10,
    prize: "300 pts",
    participants: 95,
    questions: [],
  },
  {
    id: "comp-4",
    title: "Python Data Science Quiz",
    description: "Test your Python and data analysis skills",
    status: "live",
    scheduledDate: "Mar 12, 2026 — 9:00 PM",
    timePerQuestion: 25,
    prize: "600 pts + Bronze Badge",
    participants: 67,
    questions: [
      {
        id: 1,
        question: "Which library is used for data manipulation in Python?",
        options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
        correctIndex: 1,
        timeLimit: 25,
      },
    ],
  },
  {
    id: "comp-5",
    title: "DevOps Challenge",
    description: "Docker, Kubernetes, and CI/CD pipeline questions",
    status: "draft",
    scheduledDate: "TBD",
    timePerQuestion: 30,
    prize: "800 pts + Special Badge",
    participants: 0,
    questions: [],
  },
  {
    id: "comp-6",
    title: "Cybersecurity CTF",
    description: "Capture the flag security challenges",
    status: "scheduled",
    scheduledDate: "Apr 10, 2026 — 8:00 PM",
    timePerQuestion: 45,
    prize: "1000 pts + Platinum Badge",
    participants: 0,
    questions: [],
  },
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

export default function Competitions() {
  const { t } = useLanguage();
  const [competitions, setCompetitions] =
    useState<CompetitionData[]>(MOCK_COMPETITIONS);
  const [compFormMode, setCompFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingComp, setEditingComp] = useState<CompetitionData | undefined>();

  const saveCompetition = (comp: CompetitionData) => {
    if (compFormMode === "edit") {
      setCompetitions((prev) => prev.map((c) => (c.id === comp.id ? comp : c)));
    } else {
      setCompetitions((prev) => [comp, ...prev]);
    }
    setCompFormMode("none");
    setEditingComp(undefined);
  };

  const toggleCompStatus = (
    id: string,
    newStatus: CompetitionData["status"],
  ) => {
    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
  };

  const duplicateCompetition = (comp: CompetitionData) => {
    const dup: CompetitionData = {
      ...comp,
      id: `comp-${Date.now()}`,
      title: `${comp.title} (Copy)`,
      status: "draft",
      participants: 0,
    };
    setCompetitions((prev) => [dup, ...prev]);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <p className="text-[12px] sm:text-[13px] text-muted-foreground">
            {t("dash.managing")}{" "}
            <span className="text-foreground font-medium">
              {competitions.length}
            </span>{" "}
            {t("dash.competitions")}
          </p>
          <PrimaryBtn
            onClick={() => {
              setCompFormMode("create");
              setEditingComp(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("dash.add_competition")}</span><span className="sm:hidden">New</span>
          </PrimaryBtn>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {competitions.map((comp) => (
            <div
              className="bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <h4 className="text-[13px] sm:text-[14px] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {comp.title}
                </h4>
              </div>

              <p className="text-[11px] sm:text-[12px] text-muted-foreground mb-3 sm:mb-4 line-clamp-2 group-hover:text-foreground/70 transition-colors">
                {comp.description}
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span
                  className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${statusBadge(comp.status)}`}
                >
                  {comp.status}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-muted-foreground font-mono mb-3 sm:mb-4 flex-wrap group-hover:text-foreground/70 transition-colors">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {comp.timePerQuestion}s/q
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> {comp.prize}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                    Participants
                  </p>
                  <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                    {comp.participants}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {comp.status === "draft" && (
                    <button
                      onClick={() => toggleCompStatus(comp.id, "scheduled")}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group/btn"
                      title="Schedule"
                    >
                      <Calendar className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  {comp.status === "scheduled" && (
                    <button
                      onClick={() => toggleCompStatus(comp.id, "live")}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 group/btn"
                      title="Go Live"
                    >
                      <Play className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  {comp.status === "live" && (
                    <button
                      onClick={() => toggleCompStatus(comp.id, "ended")}
                      className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn"
                      title="End"
                    >
                      <StopCircle className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  )}
                  <button
                    onClick={() => duplicateCompetition(comp)}
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group/btn"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      setCompFormMode("edit");
                      setEditingComp(comp);
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
                      setCompetitions((prev) =>
                        prev.filter((c) => c.id !== comp.id),
                      )
                    }
                    className="p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn"
                  >
                    <Trash2 className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BottomDrawer
          open={compFormMode !== "none"}
          onClose={() => {
            setCompFormMode("none");
            setEditingComp(undefined);
          }}
          title={
            compFormMode === "edit" ? t("dash.edit_competition") : t("dash.add_competition")
          }
        >
          <CompetitionForm
            initial={editingComp}
            isEdit={compFormMode === "edit"}
            onSave={saveCompetition}
            onCancel={() => {
              setCompFormMode("none");
              setEditingComp(undefined);
            }}
          />
        </BottomDrawer>
      </div>
    </PageTransition>
  );
}
