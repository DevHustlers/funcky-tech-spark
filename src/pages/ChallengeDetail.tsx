import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  Trophy,
  Users,
  Clock,
  ArrowLeft,
  ArrowRight,
  Code,
  Shield,
  Zap,
  Terminal,
  Play,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { getChallengeById } from "@/services/challenges.service";
import type { Tables } from "@/types/database";

type Challenge = Tables<"challenges">;

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (id) {
        const { data } = await getChallengeById(id);
        if (data) setChallenge(data);
      }
      setLoading(false);
    };
    fetchChallenge();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <Navbar />
        <div className="pt-40 text-center font-mono animate-pulse">
          FETCHING_CHALLENGE_DETAILS...
        </div>
        <Footer />
      </PageLayout>
    );
  }

  if (!id || !challenge) {
    return <Navigate to="/challenges" replace />;
  }

  const difficultyColor = (d: string) => {
    switch (d) {
      case "Easy": return "text-emerald-500 border-emerald-500/30 bg-emerald-500/5";
      case "Medium": return "text-amber-500 border-amber-500/30 bg-amber-500/5";
      case "Hard": return "text-orange-500 border-orange-500/30 bg-orange-500/5";
      default: return "text-red-500 border-red-500/30 bg-red-500/5";
    }
  };

  return (
    <PageLayout>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 sm:pt-40 pb-12 bg-accent/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <Link 
            to="/challenges" 
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" /> Back to Challenges
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest px-2 py-0.5 border border-border">
                  {challenge.track}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 border ${difficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
                {challenge.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-background p-6 border border-border shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Reward</span>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xl font-mono font-bold">{challenge.points} pts</span>
                </div>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mb-1">Time</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-foreground" />
                  <span className="text-xl font-mono font-bold">{challenge.duration || "∞"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <ScrollReveal>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-primary" /> Challenge Overview
                  </h2>
                  <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                    <p>
                      In this challenge, you will demonstrate your proficiency in {challenge.track} by building a project that meets the specific requirements listed below.
                    </p>
                    <p>
                      Pay close attention to performance, accessibility, and code quality. Your submission will be evaluated based on these criteria.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Requirements
                  </h2>
                  <div className="grid gap-4">
                    {(challenge.requirements?.split('\n') || [
                      "Implement all core features specified in the prompt.",
                      "Ensure the application is fully responsive.",
                      "Write clean, well-documented code.",
                      "Handle all edge cases and error states appropriately.",
                      "Optimize for performance and load times."
                    ]).map((req, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 border border-border bg-accent/5">
                        <div className="w-5 h-5 rounded-full border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-[14px] text-foreground font-medium">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="space-y-8">
              <ScrollReveal delay={200}>
                <div className="p-6 border border-border bg-background space-y-6 sticky top-24">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Ready to start?</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      Accept this challenge to start your project. You'll gain access to the starter files and submission portal.
                    </p>
                  </div>
                  
                  <button className="w-full flex items-center justify-center gap-2 py-4 bg-foreground text-background font-bold uppercase tracking-widest text-[13px] hover:bg-foreground/90 transition-all">
                    Accept Challenge <Play className="w-4 h-4 fill-current shrink-0" />
                  </button>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> 128 participants</span>
                    <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Private Repo</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default ChallengeDetail;
