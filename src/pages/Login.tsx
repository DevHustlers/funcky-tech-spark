import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import PageLayout from "@/components/PageLayout";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { SiGithub, SiGoogle } from "react-icons/si";
import { updateUserStreak } from "@/services/gamification.service";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !email || !password) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (data?.session) {
        // Check if user is soft deleted
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_deleted')
          .eq('id', data.user.id)
          .single();

        if (profile?.is_deleted) {
          await supabase.auth.signOut();
          setError('This account has been deleted. Please sign up for a new account.');
          return;
        }

        // --- UPDATE STREAK ON SIGN IN ---
        await updateUserStreak(data.user.id);

        navigate('/');
      } else {
        setError('Login failed unexpectedly');
      }
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('rate limit')) {
        setError('Email rate limit exceeded. Please wait or use a different email address. (Admins: Disable "Confirm Email" in Supabase Auth settings to bypass this during testing).');
      } else if (err.message?.toLowerCase().includes('api key') || err.message?.toLowerCase().includes('apikey')) {
        setError('No API key found in request. Please check your Supabase configuration and .env variables.');
      } else if (err.message?.toLowerCase().includes('email not confirmed')) {
        setError(
          <div className="flex flex-col gap-2">
            <span>Email not confirmed. Please check your inbox for the verification code.</span>
            <button 
              onClick={() => navigate('/signup', { state: { email, step: 3 } })}
              className="text-foreground font-bold underline text-left hover:text-primary transition-colors"
            >
              Go to Verification Page
            </button>
          </div> as any
        );
      } else {
        setError(err.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || `An error occurred during ${provider} sign in`);
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-2 h-14 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center pt-14">
          <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-16">
            <div className="mb-8">
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                {t("login.label")}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                {t("login.title")}
              </h1>
              <p className="text-muted-foreground text-[15px]">
                {t("login.desc")}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                  {t("login.email")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[13px] font-medium text-foreground font-mono uppercase tracking-wider">
                    {t("login.password")}
                  </label>
                  <Link to="/forgot-password" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors font-mono">
                    {t("login.forgot")}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pe-12 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors mt-2 disabled:opacity-50">
                {loading ? "Signing in..." : t("login.signin")}
                {!loading && <ArrowRight className="w-4 h-4 rtl:rotate-180" />}
              </button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">{t("login.or")}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleOAuth('github')}
                disabled={loading}
                className="h-12 flex items-center justify-center gap-2 border border-border text-foreground text-[13px] font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                <SiGithub className="w-4 h-4" />
                GitHub
              </button>
              <button 
                onClick={() => handleOAuth('google')}
                disabled={loading}
                className="h-12 flex items-center justify-center gap-2 border border-border text-foreground text-[13px] font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                <SiGoogle className="w-4 h-4 text-[#EA4335]" />
                Google
              </button>
            </div>

            <p className="text-center text-[14px] text-muted-foreground mt-10">
              {t("login.no_account")}{" "}
              <Link to="/signup" className="text-foreground font-medium hover:underline">
                {t("login.signup_link")}
              </Link>
            </p>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-2 h-10 flex items-center">
            <p className="text-[11px] text-muted-foreground/50 font-mono">© 2026 DevHustlers</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
