import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import PageLayout from "@/components/PageLayout";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"request" | "verify">("request");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !email) return;

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setStep("verify");
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      setError(err.message || "An error occurred while requesting password reset");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !code) return;

    setLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "recovery",
      });

      if (verifyError) throw verifyError;
      
      // If verification is successful, Supabase signs the user in.
      // We then navigate to the reset-password page.
      navigate("/reset-password");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code");
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
            <Link to="/login" className="inline-flex items-center gap-2 text-[12px] text-muted-foreground hover:text-foreground transition-colors font-mono uppercase tracking-wider mb-6">
              <ArrowLeft className="w-3 h-3" />
              {t("forgot.back")}
            </Link>

            {step === "request" ? (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("forgot.label")} Step 1
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("forgot.title.step1")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("forgot.desc.step1")}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetRequest} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("forgot.email")}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 px-4 ps-11 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                      t("forgot.send_code")
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("forgot.label")} Step 2
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("forgot.title.step2")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("forgot.desc.step2")} ({email})
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("forgot.code")}
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="w-full h-12 px-4 bg-background border border-border text-foreground text-[20px] tracking-[0.5em] text-center placeholder:text-muted-foreground/20 focus:outline-none focus:ring-2 focus:ring-ring transition-colors font-mono"
                    />
                  </div>

                  <button 
                    disabled={loading} 
                    type="submit" 
                    className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      t("forgot.verify")
                    )}
                  </button>
                  
                  <p className="text-center text-[13px] text-muted-foreground mt-6">
                    Didn't receive the code?{" "}
                    <button type="button" onClick={handleResetRequest} className="text-foreground font-medium hover:underline">
                      Resend
                    </button>
                  </p>
                </form>
              </>
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

export default ForgotPassword;
