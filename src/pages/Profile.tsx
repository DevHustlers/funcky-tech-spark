import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLayout from "@/components/PageLayout";
import SectionDivider from "@/components/SectionDivider";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { Calendar, Mail, Zap, Trophy, LogOut, Flame, ChevronDown, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/types/database";
import { useLanguage } from "@/i18n/LanguageContext";
import { toast } from "sonner";

const Profile = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [updatingLevel, setUpdatingLevel] = useState(false);
  const navigate = useNavigate();

  const LEVELS = ["beginner", "intermediate", "advanced", "expert"];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data) setProfile(data);
  };

  const updateLevel = async (newLevel: string) => {
    if (!user || updatingLevel) return;
    
    setUpdatingLevel(true);
    const { error } = await supabase
      .from('profiles')
      .update({ level: newLevel })
      .eq('id', user.id);

    if (error) {
      toast.error("Failed to update level.");
    } else {
      setProfile(prev => prev ? { ...prev, level: newLevel } : null);
      setIsEditingLevel(false);
      toast.success(`Level updated to ${t(`level.${newLevel}`)}!`);
    }
    setUpdatingLevel(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!user) return (
    <PageLayout>
      <Navbar />
      <div className="min-h-screen flex flex-col pt-28 pb-16 px-4 items-center justify-center">
        <p className="text-muted-foreground font-mono">Loading profile...</p>
      </div>
      <Footer />
    </PageLayout>
  );

  const initial = profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <PageLayout>
      <Navbar />
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-20 min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-6 flex-1 w-full">
          <div className="border border-border bg-background p-8 md:p-12 mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-foreground"></div>
            
            <div className="absolute top-8 right-8">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-[12px] font-mono text-muted-foreground hover:text-red-500 transition-colors bg-accent/30 px-3 py-1.5 border border-border"
              >
                <LogOut className="w-3.5 h-3.5" /> SIGN_OUT
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-foreground text-background flex items-center justify-center text-4xl md:text-5xl font-bold rounded-none shrink-0 border-2 border-foreground relative">
                {initial}
                {profile?.streak_count && profile.streak_count > 0 && (
                  <div className="absolute -top-3 -right-3 bg-orange-500 text-white rounded-full w-10 h-10 flex flex-col items-center justify-center text-[11px] font-bold shadow-lg animate-bounce duration-300">
                    <Flame className="w-4 h-4" />
                    {profile.streak_count}
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {profile?.full_name || "Developer"}
                  </h1>
                  <p className="text-muted-foreground text-[15px] font-mono mt-1">
                    @{profile?.username || user.email?.split('@')[0]}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 bg-accent/20">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border border-border px-3 py-1.5 bg-accent/20">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile?.created_at || user.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setIsEditingLevel(!isEditingLevel)}
                      className="flex items-center gap-2 border border-foreground px-3 py-1.5 bg-foreground text-background font-bold uppercase tracking-widest text-[11px] hover:bg-foreground/90 transition-all active:scale-95"
                    >
                      <Zap className={`w-3.5 h-3.5 ${updatingLevel ? "animate-pulse" : "fill-current"}`} />
                      <span>{t(`level.${profile?.level || "beginner"}`)}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isEditingLevel ? "rotate-180" : ""}`} />
                    </button>

                    {isEditingLevel && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border shadow-2xl z-50 overflow-hidden">
                        <div className="p-2 border-b border-border bg-accent/50 group">
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t("signup.choose_level")}</p>
                        </div>
                        {LEVELS.map((lvl) => (
                          <button
                            key={lvl}
                            disabled={updatingLevel}
                            onClick={() => updateLevel(lvl)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0 ${
                              profile?.level === lvl ? "bg-accent/30 text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-widest">
                              {t(`level.${lvl}`)}
                            </span>
                            {profile?.level === lvl && <Check className="w-3.5 h-3.5 text-foreground" />}
                            {updatingLevel && profile?.level !== lvl && <Loader2 className="w-3 h-3 animate-spin opacity-20" />}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {isEditingLevel && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsEditingLevel(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-mono text-foreground mb-4 uppercase tracking-widest flex items-center gap-2 border-b border-border pb-3">
                    <Trophy className="w-4 h-4" /> Selected Tracks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.user_metadata?.tracks?.map((track: string) => (
                      <span key={track} className="px-3 py-1 border border-foreground bg-foreground text-background text-[13px] font-medium transition-colors">
                        {track}
                      </span>
                    )) || <span className="text-[13px] text-muted-foreground italic font-mono bg-accent/30 px-3 py-1 border border-border">No tracks selected yet.</span>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[13px] font-mono text-foreground mb-4 uppercase tracking-widest flex items-center gap-2 border-b border-border pb-3">
                    <Zap className="w-4 h-4" /> Activity & Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-border p-5 bg-accent/10 flex flex-col items-center justify-center text-center group hover:bg-emerald-500/5 transition-colors duration-300">
                      <div className="text-3xl font-bold font-mono text-foreground mb-1 mt-2 text-emerald-500">
                        {profile?.points?.toLocaleString() || 0}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Points</div>
                    </div>
                    <div className="border border-border p-5 bg-accent/10 flex flex-col items-center justify-center text-center group hover:bg-orange-500/5 transition-colors duration-300">
                      <div className="text-3xl font-bold font-mono text-foreground mb-1 mt-2 text-orange-500">
                        {profile?.streak_count || 0}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SectionDivider />
      <Footer />
    </PageLayout>
  );
};

export default Profile;
