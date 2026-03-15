import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Sparkles, Flame, Rocket, Gem, Crown, Star, Heart, Trophy, Shield, Target, Swords, Diamond, Hexagon, Compass, Anchor, Lightbulb, Bolt, Medal, BadgeCheck, Zap } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { BADGE_TIERS, type BadgeTier } from "@/components/HonorBadge";
import { BadgeForm } from "./components/BadgeForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { getBadges, createBadge, updateBadge, deleteBadge as removeBadge } from "@/services/badges.service";
import { toast } from "sonner";
import type { Tables } from "@/types/database";

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
  dbId?: string; // Add dbId to store the actual database ID
}

// Helper to determine styling based on points
const getBadgeStyles = (points: number) => {
  if (points >= 10000) return { id: "mythic", borderClass: "border-purple-500/50", bgClass: "bg-purple-500/10", colorClass: "text-purple-500" };
  if (points >= 5000) return { id: "titan", borderClass: "border-blue-500/50", bgClass: "bg-blue-500/10", colorClass: "text-blue-500" };
  if (points >= 2000) return { id: "voyager", borderClass: "border-emerald-500/50", bgClass: "bg-emerald-500/10", colorClass: "text-emerald-500" };
  if (points >= 500) return { id: "igniter", borderClass: "border-amber-500/50", bgClass: "bg-amber-500/10", colorClass: "text-amber-500" };
  return { id: "spark", borderClass: "border-muted-foreground/30", bgClass: "bg-muted-foreground/5", colorClass: "text-muted-foreground" };
};

const mapDBBadgeToBadge = (b: Tables<'badges'>): BadgeWithIcon => {
  const styles = getBadgeStyles(b.min_points);
  const IconObj = AVAILABLE_ICONS.find(i => i.name === b.icon_key) || AVAILABLE_ICONS[0];
  return {
    dbId: b.id, // Store the database ID
    id: styles.id as any, // This is the tiered ID (spark, igniter, etc.)
    nameKey: b.name,
    minPoints: b.min_points,
    icon: IconObj.icon,
    iconName: IconObj.name,
    ...styles
  };
};

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
  const [badges, setBadges] = useState<BadgeWithIcon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null); // This will be the dbId for editing
  const [editName, setEditName] = useState("");
  const [editMinPoints, setEditMinPoints] = useState(0);
  const [showIconPicker, setShowIconPicker] = useState<string | null>(null);
  const [showBadgeForm, setShowBadgeForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    const { data, error } = await getBadges();
    if (!error && data) {
      setBadges(data.map(mapDBBadgeToBadge));
    } else {
      console.error("Error fetching badges:", error);
    }
    setLoading(false);
  };

  const saveBadge = async (badgeToSave: Omit<BadgeWithIcon, 'id' | 'icon' | 'borderClass' | 'bgClass' | 'colorClass'> & { dbId?: string }) => {
    if (isSubmitting) return;

    const dbPayload = {
      name: badgeToSave.nameKey,
      min_points: badgeToSave.minPoints,
      icon_key: badgeToSave.iconName,
    };

    setIsSubmitting(true);
    try {
      if (badgeToSave.dbId) { // If dbId exists, it's an update
        const { data, error } = await updateBadge(badgeToSave.dbId, dbPayload);
        if (!error && data) {
          setBadges(prev => prev.map(b => b.dbId === badgeToSave.dbId ? mapDBBadgeToBadge(data) : b));
          setShowBadgeForm(false);
          setEditingBadgeId(null);
        } else {
          console.error("Error updating badge:", error);
        }
      } else { // Otherwise, it's a new badge
        const { data, error } = await createBadge(dbPayload as any); // Type assertion needed as 'id' is not in payload
        if (!error && data) {
          setBadges(prev => [...prev, mapDBBadgeToBadge(data)]);
          setShowBadgeForm(false);
          setEditingBadgeId(null);
        } else {
          console.error("Error creating badge:", error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBadge = async (dbId: string) => {
    const { error } = await removeBadge(dbId);
    if (!error) {
      setBadges(prev => prev.filter(b => b.dbId !== dbId));
    } else {
      console.error("Error deleting badge:", error);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-48 text-muted-foreground">Loading badges...</div>
      </PageTransition>
    );
  }

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
            loading={isSubmitting}
            onSave={(newBadge) => {
              saveBadge(newBadge);
            }}
            onCancel={() => setShowBadgeForm(false)}
          />
        </BottomDrawer>

        <div className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl">
          <div className="divide-y divide-border">
            {badges.map((badge) => {
            const Icon = badge.icon;
            const isEditing = editingBadgeId === badge.dbId;

            return (
              <div key={badge.dbId} className="p-4 sm:p-5 hover:bg-accent/30 transition-all duration-200 group/badge last:border-b-0 last:rounded-b-2xl">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <button
                          onClick={() => setShowIconPicker(showIconPicker === badge.dbId ? null : badge.dbId)}
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

                    {showIconPicker === badge.dbId && (
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
                                    b.dbId === badge.dbId ? { ...b, icon: iconOption.icon, iconName: iconOption.name } : b
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
                      <PrimaryBtn 
                        disabled={isSubmitting}
                        onClick={() => {
                          saveBadge({
                            dbId: badge.dbId,
                            nameKey: editName,
                            minPoints: editMinPoints,
                            iconName: badge.iconName
                          });
                        }}
                      >
                        {isSubmitting ? <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Save
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
                          setEditingBadgeId(badge.dbId!);
                          setEditName(badge.nameKey);
                          setEditMinPoints(badge.minPoints);
                          setShowIconPicker(null);
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBadge(badge.dbId!)}
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
