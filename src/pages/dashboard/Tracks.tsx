import { useEffect, useState } from "react";
import {
  Sparkles,
  Flame,
  Rocket,
  Gem,
  Crown,
  Star,
  Heart,
  Trophy,
  Shield,
  Target,
  Swords,
  Diamond,
  Hexagon,
  Compass,
  Anchor,
  Lightbulb,
  Bolt,
  Medal,
  BadgeCheck,
  Zap,
  Globe,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { TrackForm } from "./components/TrackForm";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { getTracks, createTrack, updateTrack, deleteTrack as deleteTrackService } from "@/services/tracks.service";
import { toast } from "sonner";
import type { Tables } from "@/types/database";

interface TrackData {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  iconName: string;
  color: string;
}

// Helper to map DB track to UI TrackData
const mapDBTrackToTrackData = (track: Tables<'tracks'>): TrackData => ({
  id: track.id,
  name: track.name,
  slug: track.slug,
  description: track.description || "",
  long_description: track.long_description || "",
  iconName: track.icon_key || "Sparkles",
  color: track.color || "#3b82f6",
});

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

export default function Tracks() {
  const { t } = useLanguage();
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackFormMode, setTrackFormMode] = useState<
    "none" | "create" | "edit"
  >("none");
  const [editingTrack, setEditingTrack] = useState<TrackData | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    const { data, error } = await getTracks();
    if (!error && data) {
      setTracks(data.map(mapDBTrackToTrackData));
    }
    setLoading(false);
  };

  const saveTrack = async (track: TrackData) => {
    if (isSubmitting) return;

    const payload = {
      name: track.name,
      slug: track.slug,
      description: track.description,
      long_description: track.long_description,
      icon_key: track.iconName,
      color: track.color,
    };

    setIsSubmitting(true);
    try {
      if (trackFormMode === "edit") {
        const { data, error } = await updateTrack(track.id, payload);
        if (!error && data) {
          setTracks((prev) => prev.map((t) => (t.id === track.id ? mapDBTrackToTrackData(data) : t)));
          setTrackFormMode("none");
          setEditingTrack(undefined);
          toast.success("Track updated successfully");
        } else {
          toast.error(error || "Failed to update track");
        }
      } else {
        const { data, error } = await createTrack(payload);
        if (!error && data) {
          setTracks((prev) => [mapDBTrackToTrackData(data), ...prev]);
          setTrackFormMode("none");
          setEditingTrack(undefined);
          toast.success("Track created successfully");
        } else {
          toast.error(error || "Failed to create track");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this track? This will affect all associated challenges.")) return;
    
    const { error } = await deleteTrackService(id);
    if (!error) {
      setTracks((prev) => prev.filter((t) => t.id !== id));
      toast.success("Track deleted successfully");
    } else {
      toast.error(error || "Failed to delete track");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] text-muted-foreground">
              {t("dash.managing")}{" "}
              <span className="text-foreground font-medium">
                {tracks.length}
              </span>{" "}
              {t("dash.tracks")}
            </p>
          </div>
          <PrimaryBtn
            onClick={() => {
              setTrackFormMode("create");
              setEditingTrack(undefined);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> {t("dash.add_track")}
          </PrimaryBtn>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track) => {
            const iconData = AVAILABLE_ICONS.find(
              (i) => i.name === track.iconName,
            );
            const TrackIcon = iconData?.icon || Globe;
            return (
              <div
                key={track.id}
                className="group bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div 
                      className="w-12 h-12 flex items-center justify-center border border-border bg-accent/30 rounded-xl group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300 shrink-0"
                      style={{ borderColor: `${track.color}40`, backgroundColor: `${track.color}10` }}
                    >
                      <TrackIcon className="w-6 h-6" style={{ color: track.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors">
                          {track.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 border border-border text-muted-foreground uppercase tracking-wider">
                          /{track.slug}
                        </span>
                      </div>
                      <p className="text-[13px] text-muted-foreground line-clamp-2 group-hover:text-foreground/70 transition-colors">
                        {track.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    <button
                      onClick={() => {
                        setTrackFormMode("edit");
                        setEditingTrack(track);
                      }}
                      disabled={isSubmitting}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg disabled:opacity-50"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      disabled={isSubmitting}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {tracks.length === 0 && (
            <div className="col-span-2 bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-12 text-center">
              <p className="text-[13px] text-muted-foreground">
                No tracks yet. Add one to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomDrawer
        open={trackFormMode !== "none"}
        onClose={() => {
          setTrackFormMode("none");
          setEditingTrack(undefined);
        }}
        title={trackFormMode === "edit" ? t("dash.edit_track") : t("dash.add_track")}
      >
        <TrackForm
          initial={editingTrack}
          isEdit={trackFormMode === "edit"}
          loading={isSubmitting}
          onSave={saveTrack}
          onCancel={() => {
            setTrackFormMode("none");
            setEditingTrack(undefined);
          }}
        />
      </BottomDrawer>
    </PageTransition>
  );
}
