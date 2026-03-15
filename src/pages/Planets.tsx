import { useState, useEffect } from "react";
import {
  ArrowRight,
  Code,
  Server,
  BarChart3,
  Brain,
  Shield,
  Smartphone,
  Cpu,
  Palette,
  Wifi,
  Search,
  Users,
  Trophy,
  TrendingUp,
  Layers,
  Database,
  Cloud,
  Globe,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import OrbitsBackground from "@/components/OrbitsBackground";
import { getTracks } from "@/services/tracks.service";
import type { Tables } from "@/types/database";

type Track = Tables<"tracks">;

const getTrackIcon = (iconKey: string | null) => {
  switch (iconKey) {
    case "Code": return Code;
    case "Server": return Server;
    case "BarChart3": return BarChart3;
    case "Brain": return Brain;
    case "Shield": return Shield;
    case "Smartphone": return Smartphone;
    case "Cpu": return Cpu;
    case "Palette": return Palette;
    case "Wifi": return Wifi;
    case "Search": return Search;
    case "Users": return Users;
    case "Trophy": return Trophy;
    case "TrendingUp": return TrendingUp;
    case "Layers": return Layers;
    case "Database": return Database;
    case "Cloud": return Cloud;
    case "Globe": return Globe;
    default: return Terminal;
  }
};

const Planets = () => {
  const { t } = useLanguage();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await getTracks();
      if (data) setTracks(data);
      setLoading(false);
    };
    fetchTracks();
  }, []);

  const filtered = tracks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageLayout>
      <Navbar />

      <section className="pt-14 md:pt-36 sm:pt-28 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:pl-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-4">
                {t("planets.label")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
                {t("planets.title")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg">
                {t("planets.desc")}
              </p>
            </div>
            <OrbitsBackground
              className="w-56 h-56 sm:w-72 sm:h-72 shrink-0 hidden sm:block"
              count={5}
              color="#6b7280"
              speed={0.5}
            />
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="pb-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("planets.searchPlaceholder") || "Search tracks..."}
              className="w-full bg-background border border-border px-12 py-4 font-mono text-sm focus:outline-none focus:border-foreground/40 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {filtered.map((track, i) => {
              const Icon = getTrackIcon(track.icon_key);
              return (
                <ScrollReveal key={track.id} delay={i * 80}>
                  <Link
                    to={`/tracks/${track.slug}`}
                    className="group bg-background p-8 hover:bg-accent/30 transition-all duration-500 flex flex-col h-full"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div 
                        className="w-14 h-14 flex items-center justify-center border border-border group-hover:border-foreground/20 bg-accent transition-colors"
                        style={{ borderColor: track.color ? `${track.color}40` : undefined, backgroundColor: track.color ? `${track.color}10` : undefined }}
                      >
                        <Icon 
                          className="w-7 h-7 text-foreground group-hover:scale-110 transition-transform duration-500" 
                          style={{ color: track.color || undefined }}
                        />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="mt-auto">
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        {track.name}
                      </h3>
                      <p className="text-muted-foreground text-[14px] leading-relaxed mb-6 line-clamp-2">
                        {track.description}
                      </p>

                      <div className="flex items-center gap-6 pt-6 border-t border-border/50">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">
                            {t("planets.members")}
                          </span>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-foreground" />
                            <span className="text-[13px] font-mono font-bold">
                              0
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">
                            {t("planets.challenges")}
                          </span>
                          <div className="flex items-center gap-2">
                            <Trophy className="w-3.5 h-3.5 text-foreground" />
                            <span className="text-[13px] font-mono font-bold">
                              0
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Planets;
