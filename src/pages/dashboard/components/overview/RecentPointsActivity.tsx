import { useEffect, useState } from "react";
import { Activity, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getPointsLog } from "@/services/points.service";

interface PointAward {
  id: string;
  user: string;
  action: string;
  points: string;
  time: string;
}

export const RecentPointsActivity = () => {
  const [activities, setActivities] = useState<PointAward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAwards = async () => {
      const { data, error } = await getPointsLog();
      if (!error && data) {
        setActivities(data.slice(0, 4).map(l => ({
          id: l.id,
          user: l.profiles?.full_name || "Unknown",
          action: l.reason || "Awarded points",
          points: `+${l.amount}`,
          time: new Date(l.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
      setLoading(false);
    };
    fetchRecentAwards();
  }, []);
  return (
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
        {loading ? (
          <div className="px-3 sm:px-5 py-4 text-[12px] text-muted-foreground animate-pulse">
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="px-3 sm:px-5 py-4 text-[12px] text-muted-foreground">
            No recent activity
          </div>
        ) : (
          activities.map((log) => (
            <div
              key={log.id}
              className="px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between hover:bg-accent/50 hover:ps-6 sm:hover:ps-7 transition-all duration-200 group/item cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-accent border border-border rounded-xl flex items-center justify-center text-[10px] sm:text-[11px] font-bold font-mono text-foreground group-hover/item:scale-110 group-hover/item:border-primary/30 transition-all duration-200">
                  {log.user.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-[12px] sm:text-[13px] font-medium text-foreground line-clamp-1 group-hover/item:text-primary transition-colors">
                    {log.user}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1 group-hover/item:text-foreground/70 transition-colors">
                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {log.action}
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
          ))
        )}
      </div>
      <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-border">
        <button className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary flex items-center gap-1 transition-all duration-200 hover:gap-2 group/btn">
          View all activity{" "}
          <ArrowRight className="w-3 h-3 rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
