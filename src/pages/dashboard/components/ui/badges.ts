export const statusBadge = (status: string) => {
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

export const difficultyBadge = (d: string) => {
  const map: Record<string, string> = {
    Easy: "text-emerald-500 border-emerald-500/30",
    Medium: "text-amber-500 border-amber-500/30",
    Hard: "text-orange-500 border-orange-500/30",
    Expert: "text-red-500 border-red-500/30",
  };
  return map[d] || "text-muted-foreground border-border";
};

export const roleBadge = (r: string) => {
  const map: Record<string, string> = {
    admin: "text-red-500 border-red-500/30",
    moderator: "text-blue-500 border-blue-500/30",
    member: "text-muted-foreground border-border",
  };
  return map[r] || "text-muted-foreground border-border";
};
