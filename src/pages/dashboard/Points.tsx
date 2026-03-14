import { useState } from "react";
import { Plus, Zap, Pencil, Trash2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { PointRuleForm } from "./components/PointRuleForm";
import { AwardPointsForm } from "./components/AwardPointsForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";

interface UserData {
  id: string;
  name: string;
  email: string;
  joined: string;
  points: number;
  status: "active" | "inactive" | "banned";
  role: "member" | "moderator" | "admin";
  bio: string;
}

interface PointRule {
  id: string;
  action: string;
  points: number;
  active: boolean;
}

interface PointAward {
  id: string;
  user: string;
  action: string;
  points: string;
  time: string;
}

const MOCK_USERS: UserData[] = [
  {
    id: "u-1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    joined: "2h ago",
    points: 12450,
    status: "active",
    role: "admin",
    bio: "Full-stack developer passionate about React and TypeScript.",
  },
  {
    id: "u-2",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    joined: "5h ago",
    points: 11200,
    status: "active",
    role: "moderator",
    bio: "Backend engineer specializing in Node.js and Python.",
  },
  {
    id: "u-3",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    joined: "1d ago",
    points: 10800,
    status: "active",
    role: "member",
    bio: "UI/UX designer turned frontend developer.",
  },
  {
    id: "u-4",
    name: "James Park",
    email: "james@example.com",
    joined: "2d ago",
    points: 9650,
    status: "inactive",
    role: "member",
    bio: "Data scientist exploring ML and AI.",
  },
  {
    id: "u-5",
    name: "Fatima Al-Sayed",
    email: "fatima@example.com",
    joined: "3d ago",
    points: 8900,
    status: "active",
    role: "member",
    bio: "Cybersecurity enthusiast and CTF player.",
  },
];

const MOCK_POINT_RULES: PointRule[] = [
  { id: "pr-1", action: "Complete a challenge", points: 500, active: true },
  { id: "pr-2", action: "Daily login", points: 10, active: true },
  { id: "pr-3", action: "Login streak (7d)", points: 50, active: true },
  { id: "pr-4", action: "Login streak (30d)", points: 200, active: true },
  { id: "pr-5", action: "Follow Discord", points: 50, active: true },
  { id: "pr-6", action: "Follow Twitter/X", points: 50, active: true },
  { id: "pr-7", action: "Follow LinkedIn", points: 30, active: false },
  { id: "pr-8", action: "Follow GitHub", points: 40, active: true },
  { id: "pr-9", action: "Follow Telegram", points: 30, active: true },
  { id: "pr-10", action: "Follow WhatsApp", points: 20, active: false },
  { id: "pr-11", action: "Follow YouTube", points: 30, active: true },
  { id: "pr-12", action: "Refer a friend", points: 200, active: true },
  { id: "pr-13", action: "Submit bug report", points: 100, active: true },
  { id: "pr-14", action: "Complete tutorial", points: 150, active: true },
  { id: "pr-15", action: "Share on social media", points: 25, active: true },
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
    action: "Bug report reward",
    points: "+100",
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
    action: "Followed GitHub",
    points: "+40",
    time: "7h ago",
  },
  {
    id: "pl-10",
    user: "Michael Brown",
    action: "Tutorial completion",
    points: "+150",
    time: "8h ago",
  },
];

const PrimaryBtn = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

const SecondaryBtn = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-[13px] font-medium rounded-xl hover:bg-accent hover:border-primary/50 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    {children}
  </button>
);

export default function Points() {
  const { t } = useLanguage();
  const [pointRules, setPointRules] = useState<PointRule[]>(MOCK_POINT_RULES);
  const [pointLog, setPointLog] = useState<PointAward[]>(MOCK_POINT_LOG);
  const [ruleFormMode, setRuleFormMode] = useState<"none" | "create" | "edit">(
    "none",
  );
  const [editingRule, setEditingRule] = useState<PointRule | undefined>();
  const [showAwardForm, setShowAwardForm] = useState(false);

  const savePointRule = (rule: PointRule) => {
    if (ruleFormMode === "edit") {
      setPointRules((prev) => prev.map((r) => (r.id === rule.id ? rule : r)));
    } else {
      setPointRules((prev) => [...prev, rule]);
    }
    setRuleFormMode("none");
    setEditingRule(undefined);
  };

  const deletePointRule = (id: string) =>
    setPointRules((prev) => prev.filter((r) => r.id !== id));
  const togglePointRule = (id: string) =>
    setPointRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );

  const awardPoints = (
    userId: string,
    userName: string,
    points: number,
    reason: string,
  ) => {
    const newAward: PointAward = {
      id: `pl-${Date.now()}`,
      user: userName,
      action: reason,
      points: `+${points}`,
      time: "Just now",
    };
    setPointLog((prev) => [newAward, ...prev]);
    setShowAwardForm(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">
              {t("dash.point_mgmt")}
            </p>
            <div className="flex items-center gap-2">
              <SecondaryBtn
                onClick={() => {
                  setRuleFormMode("create");
                  setEditingRule(undefined);
                }}
              >
                <Plus className="w-3.5 h-3.5" /> {t("dash.add_rule")}
              </SecondaryBtn>
              <PrimaryBtn onClick={() => setShowAwardForm(true)}>
                <Zap className="w-3.5 h-3.5" /> {t("dash.award_points")}
              </PrimaryBtn>
            </div>
          </div>
        </div>

        <BottomDrawer
          open={showAwardForm}
          onClose={() => setShowAwardForm(false)}
          title={t("dash.award_points")}
        >
          <AwardPointsForm
            users={MOCK_USERS}
            onAward={awardPoints}
            onCancel={() => setShowAwardForm(false)}
          />
        </BottomDrawer>

        <BottomDrawer
          open={ruleFormMode !== "none"}
          onClose={() => {
            setRuleFormMode("none");
            setEditingRule(undefined);
          }}
          title={ruleFormMode === "edit" ? t("dash.edit_rule") : t("dash.add_rule")}
        >
          <PointRuleForm
            initial={editingRule}
            isEdit={ruleFormMode === "edit"}
            onSave={savePointRule}
            onCancel={() => {
              setRuleFormMode("none");
              setEditingRule(undefined);
            }}
          />
        </BottomDrawer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                {t("dash.auto_rules")}
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">
                {pointRules.length} {t("dash.rules")}
              </span>
            </div>
            <div className="divide-y divide-border">
              {pointRules.slice(0, 13).map((rule) => (
                <div
                  key={rule.id}
                  className="px-4 sm:px-5 py-3 flex items-center justify-between group/item hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePointRule(rule.id)}
                      className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${rule.active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                      title={
                        rule.active
                          ? t("dash.active_rule")
                          : t("dash.inactive_rule")
                      }
                    />
                    <span
                      className={`text-[13px] ${rule.active ? "text-foreground" : "text-muted-foreground line-through"}`}
                    >
                      {rule.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-mono font-bold text-emerald-500">
                      +{rule.points}
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setRuleFormMode("edit");
                          setEditingRule(rule);
                        }}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deletePointRule(rule.id)}
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
                {t("dash.recent_awards")}
              </h3>
              <span className="text-[11px] font-mono text-muted-foreground">
                {pointLog.length} {t("dash.entries")}
              </span>
            </div>
            <div className="divide-y divide-border">
              {pointLog.map((log) => (
                <div
                  key={log.id}
                  className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-accent/30 transition-colors"
                >
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      {log.user}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {log.action}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-[13px] font-mono font-bold text-emerald-500">
                      {log.points}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-border">
            <h3 className="text-[13px] sm:text-[14px] font-bold text-foreground group-hover:text-primary transition-colors">
              {t("dash.channel_stats")}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
            {[
              { name: "Discord", followers: 1842 },
              { name: "Twitter/X", followers: 2156 },
              { name: "LinkedIn", followers: 1567 },
              { name: "GitHub", followers: 1923 },
              { name: "Telegram", followers: 987 },
              { name: "WhatsApp", followers: 654 },
            ].map((ch, i) => (
              <div
                key={i}
                className="bg-background border border-border rounded-xl p-3 sm:p-4 hover:border-primary/30 hover:bg-accent/20 transition-all duration-200"
              >
                <p className="text-[12px] sm:text-[13px] font-medium text-foreground mb-1">
                  {ch.name}
                </p>
                <p className="font-mono font-bold text-foreground text-[16px] sm:text-[18px]">
                  {ch.followers.toLocaleString()}
                </p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                  followers
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
