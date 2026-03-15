import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2, CheckCircle2 } from "lucide-react";
import Logo from "@/components/Logo";
import PageLayout from "@/components/PageLayout";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if we have a session (means user landed from reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If no session, they might have landed here manually or link expired
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      toast.success("Password updated successfully");
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || "An error occurred while resetting your password");
    } finally {
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
            {!success ? (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("reset.label")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("reset.title")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("reset.desc")}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleReset} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("reset.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 px-4 ps-11 pe-12 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("reset.confirm_password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-12 px-4 ps-11 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  <button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t("reset.submit")
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center p-8 bg-accent/30 border border-border rounded-2xl">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">{t("reset.success_title")}</h2>
                <p className="text-muted-foreground text-[15px] mb-8 leading-relaxed">
                  {t("reset.success_desc")}
                </p>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center w-full h-12 bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
                >
                  {t("signup.signin_link")}
                </Link>
              </div>
            )}
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

export default ResetPassword;
