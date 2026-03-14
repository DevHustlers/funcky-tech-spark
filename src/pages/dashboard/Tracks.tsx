import { useState } from "react";
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

interface TrackData {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

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

const MOCK_TRACKS: TrackData[] = [
  {
    id: "tr-1",
    name: "Frontend",
    slug: "frontend",
    description:
      "Master the art of building beautiful, responsive user interfaces with React, Vue, and modern CSS frameworks.",
    iconName: "Sparkles",
  },
  {
    id: "tr-2",
    name: "Backend",
    slug: "backend",
    description:
      "Build robust server-side systems, APIs, and microservices with Node.js, Python, and Go.",
    iconName: "Shield",
  },
  {
    id: "tr-3",
    name: "AI / ML",
    slug: "ai-ml",
    description:
      "Explore machine learning, deep learning, and AI applications using TensorFlow and PyTorch.",
    iconName: "Lightbulb",
  },
  {
    id: "tr-4",
    name: "Cybersecurity",
    slug: "cybersecurity",
    description:
      "Defend systems, discover vulnerabilities, and master ethical hacking and penetration testing.",
    iconName: "Shield",
  },
  {
    id: "tr-5",
    name: "Data Science",
    slug: "data-science",
    description:
      "Extract insights from data through statistical analysis, visualization, and predictive modeling.",
    iconName: "Target",
  },
  {
    id: "tr-6",
    name: "DevOps",
    slug: "devops",
    description:
      "Automate deployments, CI/CD pipelines, and infrastructure management with Docker and Kubernetes.",
    iconName: "Bolt",
  },
  {
    id: "tr-7",
    name: "Mobile",
    slug: "mobile",
    description:
      "Create native and cross-platform mobile applications using React Native and Flutter.",
    iconName: "Rocket",
  },
  {
    id: "tr-8",
    name: "Full Stack",
    slug: "full-stack",
    description:
      "End-to-end development spanning frontend, backend, databases, and cloud infrastructure.",
    iconName: "Crown",
  },
  {
    id: "tr-9",
    name: "Blockchain",
    slug: "blockchain",
    description:
      "Build decentralized applications, smart contracts, and understand Web3 technologies.",
    iconName: "Diamond",
  },
  {
    id: "tr-10",
    name: "Game Dev",
    slug: "game-dev",
    description:
      "Create engaging games using Unity, Godot, and modern web-based game engines.",
    iconName: "Trophy",
  },
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
  const [tracks, setTracks] = useState<TrackData[]>(MOCK_TRACKS);
  const [trackFormMode, setTrackFormMode] = useState<
    "none" | "create" | "edit"
  >("none");
  const [editingTrack, setEditingTrack] = useState<TrackData | undefined>();

  const saveTrack = (track: TrackData) => {
    if (trackFormMode === "edit") {
      setTracks((prev) => prev.map((t) => (t.id === track.id ? track : t)));
    } else {
      setTracks((prev) => [track, ...prev]);
    }
    setTrackFormMode("none");
    setEditingTrack(undefined);
  };

  const deleteTrack = (id: string) =>
    setTracks((prev) => prev.filter((t) => t.id !== id));

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
                    <div className="w-12 h-12 flex items-center justify-center border border-border bg-accent/30 rounded-xl group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300 shrink-0">
                      <TrackIcon className="w-6 h-6 text-foreground" />
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
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-lg"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTrack(track.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
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
