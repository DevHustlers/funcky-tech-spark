import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import LightRays from "@/components/LightRays";
import { Particles } from "@/components/Particles";
import { useLanguage } from "@/i18n/LanguageContext";
import { ArrowRight, Terminal, GitBranch, Sparkles } from "lucide-react";
import {
  SiWhatsapp,
  SiDiscord,
  SiX,
  SiFacebook,
} from "@icons-pack/react-simple-icons";

const COMMUNITIES = [
  {
    name: "WhatsApp",
    icon: SiWhatsapp,
    href: "#",
    members: "1.2K",
    color: "#25D366",
  },
  {
    name: "Discord",
    icon: SiDiscord,
    href: "#",
    members: "2.4K",
    color: "#5865F2",
  },
  {
    name: "X (Twitter)",
    icon: SiX,
    href: "#",
    members: "3.1K",
    color: "hsl(var(--foreground))",
  },
  {
    name: "Facebook",
    icon: SiFacebook,
    href: "#",
    members: "1.8K",
    color: "#1877F2",
  },
];

const About = () => {
  const { t } = useLanguage();

  return (
    <PageLayout>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-40 relative overflow-hidden">
        {/* Light mode: Particles */}
        <div className="absolute inset-0 pointer-events-none dark:hidden opacity-60">
          <Particles
            quantity={500}
            size={0.8}
            color="#374151"
            staticity={40}
            ease={60}
          />
        </div>
        {/* Dark mode: LightRays */}
        <div className="absolute inset-0 pointer-events-none hidden dark:block">
          <LightRays
            raysOrigin="top-center"
            raysSpeed={0.8}
            lightSpread={0.6}
            rayLength={4}
            fadeDistance={1.2}
            saturation={1.2}
            followMouse
            mouseInfluence={0.1}
            className="opacity-50"
          />
        </div>
        <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0 relative z-10">
          <div className="max-w-3xl pb-20 sm:pb-32 px-1 sm:px-4 lg:px-6">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-border text-[15px] text-muted-foreground mb-8 font-mono">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                {t("about.label")}
              </div>
            </div>

            <h1
              className="text-[clamp(2.25rem,6vw,4.5rem)] font-bold text-foreground leading-[1.05] tracking-tight mb-6 animate-fade-up"
              style={{ animationDelay: "0.08s", opacity: 0 }}
            >
              {t("about.title.1")}{" "}
              <span className="font-serif text-muted-foreground font-normal">
                {t("about.title.2")}
              </span>
              <br className="hidden sm:block" /> {t("about.title.3")}
            </h1>

            <div
              className="animate-fade-up"
              style={{ animationDelay: "0.16s", opacity: 0 }}
            >
              <p className="text-[17px] sm:text-lg md:text-xl text-muted-foreground max-w-lg mb-6 leading-relaxed">
                {t("about.p1")}
              </p>
              <p className="text-[17px] sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                {t("about.p2")}
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 animate-fade-up"
              style={{ animationDelay: "0.24s", opacity: 0 }}
            >
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors text-[16px] w-full sm:w-auto">
                {t("hero.cta.join")}
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-3 border border-border text-foreground font-medium hover:bg-accent transition-colors text-[16px] w-full sm:w-auto">
                {t("hero.cta.explore")}
              </button>
            </div>
          </div>

          {/* Mini feature row */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-t border-border animate-fade-up"
            style={{ animationDelay: "0.4s", opacity: 0 }}
          >
            {[
              {
                icon: Terminal,
                label: t("hero.mini.1.label"),
                sub: t("hero.mini.1.sub"),
              },
              {
                icon: GitBranch,
                label: t("hero.mini.2.label"),
                sub: t("hero.mini.2.sub"),
              },
              {
                icon: Sparkles,
                label: t("hero.mini.3.label"),
                sub: t("hero.mini.3.sub"),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 sm:p-6 bg-background"
              >
                <item.icon
                  className="w-5 h-5 text-muted-foreground shrink-0"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-[16px] font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <ScrollReveal>
        <section className="py-12 sm:py-16">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border-t border-border">
              {[
                {
                  value: t("about.stat.1.value"),
                  label: t("about.stat.1.label"),
                },
                {
                  value: t("about.stat.2.value"),
                  label: t("about.stat.2.label"),
                },
                {
                  value: t("about.stat.3.value"),
                  label: t("about.stat.3.label"),
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="p-6 bg-background text-center"
                >
                  <div className="text-2xl font-bold text-foreground mb-1 font-mono">
                    {s.value}
                  </div>
                  <div className="text-[13px] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />

      {/* Team */}
      <ScrollReveal>
        <TeamSection />
      </ScrollReveal>

      <SectionDivider />

      {/* Communities */}
      <ScrollReveal>
        <section className="py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-0">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6 mb-10">
              <p className="text-[13px] font-mono text-muted-foreground mb-4 uppercase tracking-widest">
                Our Communities
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight mb-3">
                Join the{" "}
                <span className="font-serif text-muted-foreground font-normal">
                  conversation
                </span>
              </h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Connect with fellow developers, get help, share your projects,
                and stay updated across all our community channels.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border-t border-border">
              {COMMUNITIES.map((community, i) => (
                <a
                  key={community.name}
                  href={community.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-4 p-8 bg-background text-center transition-all duration-300 hover:bg-accent/30"
                >
                  <community.icon
                    size={36}
                    className="text-muted-foreground/50 transition-colors duration-300"
                    style={{ color: community.color }}
                  />
                  <div>
                    <p className="text-[15px] font-bold text-foreground mb-0.5">
                      {community.name}
                    </p>
                    <p
                      className="text-[12px] font-mono transition-colors duration-300"
                      style={{ color: community.color }}
                    >
                      {community.members} members
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                    Join <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default About;
