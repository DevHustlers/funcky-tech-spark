import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Sparkles, Flame, Rocket, Gem, Crown, Star, Heart, Trophy, Shield, Target, Swords, Diamond, Hexagon, Compass, Anchor, Lightbulb, Bolt, Medal, BadgeCheck, Zap } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { BADGE_TIERS, type BadgeTier } from "@/components/HonorBadge";
import { BadgeForm } from "./components/BadgeForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";

const AVAILABLE_ICONS = [
  { name: "Sparkles", icon: Sparkles },
  { name: "Flame", icon: Flame },
  { name: "Rocket", icon: Rocket },
  { name: "Gem", icon: Gem },
  { name: "Crown", icon: Crown },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Trophy", icon: Trophy },
  { name: "Shield", icon: Shield },
  { name: "Target", icon: Target },
  { name: "Swords", icon: Swords },
  { name: "Diamond", icon: Diamond },
  { name: "Hexagon", icon: Hexagon },
  { name: "Compass", icon: Compass },
  { name: "Anchor", icon: Anchor },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Bolt", icon: Bolt },
  { name: "Medal", icon: Medal },
  { name: "BadgeCheck", icon: BadgeCheck },
  { name: "Zap", icon: Zap },
];

interface BadgeWithIcon extends BadgeTier {
  iconName: string;
}

const PrimaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-xl hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100">{children}</button>
);

const SecondaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground text-[13px] font-medium rounded-xl hover:bg-accent hover:border-primary/50 transition-all duration-200 disabled:opacity-50">{children}</button>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1.5">{children}</label>
);

const FieldInput = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full h-9 px-3 bg-background border border-border text-foreground text-[14px] focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/40 ${className}`}
  />
);

export default function Badges() {
  const { t } = useLanguage();
  const [badges, setBadges] = useState<BadgeWithIcon[]>(() =>
    BADGE_TIERS.map(b => ({
      ...b,
      iconName: b.id === "spark" ? "Sparkles" : b.id === "igniter" ? "Flame" : b.id === "voyager" ? "Rocket" : b.id === "titan" ? "Gem" : "Crown",
    }))
  );
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMinPoints, setEditMinPoints] = useState(0);
  const [showIconPicker, setShowIconPicker] = useState<string | null>(null);
  const [showBadgeForm, setShowBadgeForm] = useState(false);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex items-center justify-between">
          <p className="text-[13px] text-muted-foreground">{t("dash.manage")} <span className="text-foreground font-medium">{badges.length}</span> {t("dash.badge_tiers")}</p>
          <PrimaryBtn onClick={() => setShowBadgeForm(true)}>
            <Plus className="w-3.5 h-3.5" /> {t("dash.add_badge")}
          </PrimaryBtn>
        </div>
        </div>

        <BottomDrawer 
          open={showBadgeForm} 
          onClose={() => setShowBadgeForm(false)}
          title={t("dash.add_badge")}
        >
          <BadgeForm
            onSave={(badge) => {
              setBadges(prev => [...prev, badge]);
              setShowBadgeForm(false);
            }}
            onCancel={() => setShowBadgeForm(false)}
          />
        </BottomDrawer>

        <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl">
          <div className="divide-y divide-border">
            {badges.map((badge) => {
            const Icon = badge.icon;
            const isEditing = editingBadgeId === badge.id;

            return (
              <div key={badge.id} className="p-4 sm:p-5 hover:bg-accent/30 transition-all duration-200 group/badge last:border-b-0 last:rounded-b-2xl">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <button
                          onClick={() => setShowIconPicker(showIconPicker === badge.id ? null : badge.id)}
                          className={`w-14 h-14 flex items-center justify-center border-2 border-dashed ${badge.borderClass} ${badge.bgClass} hover:border-foreground/40 transition-colors relative rounded-xl`}
                        >
                          <Icon className={`w-7 h-7 ${badge.colorClass}`} />
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-foreground text-background flex items-center justify-center rounded-lg">
                            <Pencil className="w-2.5 h-2.5" />
                          </span>
                        </button>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <FieldLabel>Badge Name</FieldLabel>
                          <FieldInput value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>
                        <div>
                          <FieldLabel>Min Points</FieldLabel>
                          <FieldInput type="number" value={editMinPoints} onChange={(e) => setEditMinPoints(Number(e.target.value))} />
                        </div>
                      </div>
                    </div>

                    {showIconPicker === badge.id && (
                      <div className="border border-border p-4 rounded-xl">
                        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Choose Icon</p>
                        <div className="grid grid-cols-10 gap-1">
                          {AVAILABLE_ICONS.map((iconOption) => {
                            const OptionIcon = iconOption.icon;
                            const isSelected = badge.iconName === iconOption.name;
                            return (
                              <button
                                key={iconOption.name}
                                onClick={() => {
                                  setBadges(prev => prev.map(b =>
                                    b.id === badge.id ? { ...b, icon: iconOption.icon, iconName: iconOption.name } : b
                                  ));
                                  setShowIconPicker(null);
                                }}
                                className={`w-9 h-9 flex items-center justify-center border transition-colors rounded-lg ${
                                  isSelected
                                    ? "border-foreground bg-accent text-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                                }`}
                              >
                                <OptionIcon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <PrimaryBtn onClick={() => {
                        setBadges(prev => prev.map(b =>
                          b.id === badge.id ? { ...b, nameKey: editName, minPoints: editMinPoints } : b
                        ));
                        setEditingBadgeId(null);
                        setShowIconPicker(null);
                      }}>
                        <Check className="w-3.5 h-3.5" /> Save
                      </PrimaryBtn>
                      <SecondaryBtn onClick={() => { setEditingBadgeId(null); setShowIconPicker(null); }}>
                        <X className="w-3.5 h-3.5" /> Cancel
                      </SecondaryBtn>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex items-center justify-center border ${badge.borderClass} ${badge.bgClass} rounded-xl group-hover/badge:scale-110 transition-transform duration-200`}>
                        <Icon className={`w-6 h-6 ${badge.colorClass}`} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-foreground group-hover/badge:text-primary transition-colors">{badge.nameKey}</h4>
                        <div className="flex items-center gap-3 text-[12px] text-muted-foreground font-mono group-hover/badge:text-foreground/70 transition-colors">
                          <span>{badge.minPoints.toLocaleString()} pts minimum</span>
                          <span className={`${badge.colorClass}`}>●</span>
                          <span className="capitalize">{badge.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingBadgeId(badge.id);
                          setEditName(badge.nameKey);
                          setEditMinPoints(badge.minPoints);
                          setShowIconPicker(null);
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setBadges(prev => prev.filter(b => b.id !== badge.id))}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
