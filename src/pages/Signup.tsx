import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import Logo from "@/components/Logo";
import PageLayout from "@/components/PageLayout";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { SiGithub, SiGoogle } from "react-icons/si";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const TRACKS = [
  "Frontend", "Backend", "Data Science", "AI / ML",
  "Cybersecurity", "Mobile Dev", "Operating Systems", "UI/UX", "Network"
];

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [otpCode, setOtpCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameError, setUsernameMsg] = useState<string | null>(null);

  const levels = [
    { id: "beginner", key: "level.beginner" },
    { id: "intermediate", key: "level.intermediate" },
    { id: "advanced", key: "level.advanced" },
    { id: "expert", key: "level.expert" },
  ];
  
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const validateUsername = (name: string) => {
    if (name.includes(" ")) return "Username cannot contain spaces.";
    if (name.length < 3) return "Username must be at least 3 characters.";
    if (name.length > 20) return "Username cannot exceed 20 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(name)) return "Username can only contain letters, numbers, and underscores.";
    return null;
  };

  const checkUsernameAvailability = async () => {
    if (!username) {
      setUsernameAvailability('idle');
      setUsernameMsg(null);
      return;
    }

    const validationError = validateUsername(username);
    if (validationError) {
      setUsernameAvailability('taken');
      setUsernameMsg(validationError);
      return;
    }

    setUsernameAvailability('checking');
    setUsernameMsg(null);

    try {
      const { data, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .single();

      if (checkError && checkError.code === 'PGRST116') {
        // Not found means it's available
        setUsernameAvailability('available');
        setUsernameMsg("Username is available!");
      } else if (data) {
        setUsernameAvailability('taken');
        setUsernameMsg("This username is already taken.");
      } else {
        setUsernameAvailability('idle');
      }
    } catch (err) {
      setUsernameAvailability('idle');
    }
  };

  useEffect(() => {
    if (location.state?.email && location.state?.step === 4) {
      setEmail(location.state.email);
      setStep(4);
    }
  }, [location.state]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (username) {
        checkUsernameAvailability();
      } else {
        setUsernameAvailability('idle');
        setUsernameMsg(null);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [username]);

  const handleSignup = async () => {
    if (loading) return;
    if (!email || !password || !confirmPassword || !firstName || !lastName || !username) {
      setError("Please fill in all fields before continuing.");
      setStep(1);
      return;
    }

    if (selectedTracks.length === 0) {
      setError("Please select at least one track.");
      setStep(2);
      return;
    }

    if (!selectedLevel) {
      setError("Please select your expertise level.");
      setStep(3);
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setStep(1);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setStep(1);
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Check if username is already taken
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingUser) {
        setLoading(false);
        setError("This username is already taken. Please choose another one.");
        setStep(1);
        return;
      }
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            username,
            tracks: selectedTracks,
            level: selectedLevel,
            role: "user"
          }
        }
      });

      if (signupError) throw signupError;
 
      if (data?.user) {
        if (!data.session) {
          // Email confirmation is required
          setStep(4);
          toast.success("Verification code sent to your email!");
        } else {
          // Already signed in (confirmation off)
          navigate('/');
        }
      } else {
        setError('Signup failed unexpectedly');
      }
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('rate limit')) {
        setError('Email rate limit exceeded. Please wait or use a different email address. (Admins: Disable "Confirm Email" in Supabase Auth settings to bypass this during testing).');
      } else if (err.message?.toLowerCase().includes('api key') || err.message?.toLowerCase().includes('apikey')) {
        setError('No API key found in request. Please check your Supabase configuration and .env variables.');
      } else if (err.status === 500 || err.message?.toLowerCase().includes('500') || err.message?.toLowerCase().includes('database error')) {
        setError('Server Error (500): This is likely an SMTP configuration issue in your Supabase Dashboard. Check your Gmail App Password and SMTP settings.');
      } else {
        setError(err.message || 'An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (loading || !otpCode || otpCode.length < 8) return;
    setLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup'
      });

      if (verifyError) throw verifyError;
      
      toast.success("Account verified! Welcome to DevHustlers.");
      navigate('/');
    } catch (err: any) {
      if (err.status === 500 || err.message?.toLowerCase().includes('500')) {
        setError('Server Error (500): Could not connect to authentication server. Please check your Supabase logs.');
      } else {
        setError(err.message || "Invalid or expired verification code.");
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
      setError(err.message || `An error occurred during ${provider} signup`);
      setLoading(false);
    }
  };

  const toggleTrack = (track: string) => {
    setSelectedTracks(prev =>
      prev.includes(track) ? prev.filter(t => t !== track) : [...prev, track]
    );
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
            <div className="flex items-center gap-2 mb-10">
              <div className={`h-1 flex-1 ${step >= 1 ? "bg-foreground" : "bg-border"} transition-colors`} />
              <div className={`h-1 flex-1 ${step >= 2 ? "bg-foreground" : "bg-border"} transition-colors`} />
              <div className={`h-1 flex-1 ${step >= 3 ? "bg-foreground" : "bg-border"} transition-colors`} />
              <div className={`h-1 flex-1 ${step >= 4 ? "bg-foreground" : "bg-border"} transition-colors`} />
            </div>

            {step === 1 && (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("signup.step1")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("signup.title")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("signup.desc")}
                  </p>
                </div>

                {error && step === 1 && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        {t("signup.first_name")}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                        {t("signup.last_name")}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full h-12 px-4 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("signup.username")}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value.toLowerCase().replace(/\s/g, ''));
                        }}
                        onBlur={checkUsernameAvailability}
                        placeholder="johndoe"
                        className={`w-full h-12 px-4 bg-background border ${
                          usernameAvailability === 'available' ? 'border-green-500' : 
                          usernameAvailability === 'taken' ? 'border-red-500' : 'border-border'
                        } text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors`}
                      />
                      {usernameAvailability === 'checking' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                        </div>
                      )}
                      {usernameAvailability === 'available' && (
                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                    {usernameError && (
                      <p className={`mt-1.5 text-[12px] font-mono ${
                        usernameAvailability === 'available' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {usernameError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("signup.email")}
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
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      {t("signup.password")}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("signup.password_hint")}
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

                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full h-12 px-4 pe-12 bg-background border border-border text-foreground text-[15px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors mt-2"
                  >
                    {t("signup.continue")}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("signup.step2")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("signup.choose_tracks")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("signup.choose_desc")}
                  </p>
                </div>

                {error && step === 2 && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-8">
                  {TRACKS.map((track) => {
                    const selected = selectedTracks.includes(track);
                    return (
                      <button
                        key={track}
                        onClick={() => toggleTrack(track)}
                        className={`relative h-14 px-4 flex items-center gap-3 border text-[14px] font-medium transition-all ${
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        {selected && <Check className="w-4 h-4 shrink-0" />}
                        <span className={selected ? "" : "ms-7"}>{track}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="h-12 px-6 flex items-center justify-center border border-border text-foreground font-medium text-[15px] hover:bg-accent transition-colors"
                  >
                    {t("signup.back")}
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors"
                  >
                    {t("signup.continue")}
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("signup.step3")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    {t("signup.choose_level")}
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    {t("signup.level_desc")}
                  </p>
                </div>

                {error && step === 3 && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {levels.map((level) => {
                    const selected = selectedLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        className={`relative h-16 px-6 flex items-center justify-between border text-[15px] font-bold transition-all ${
                          selected
                            ? "border-foreground bg-foreground text-background ring-4 ring-foreground/20"
                            : "border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        <span className="uppercase tracking-widest">{t(level.key)}</span>
                        {selected && <Check className="w-5 h-5" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="h-12 px-6 flex items-center justify-center border border-border text-foreground font-medium text-[15px] hover:bg-accent transition-colors"
                  >
                    {t("signup.back")}
                  </button>
                  <button 
                    disabled={loading}
                    onClick={handleSignup} 
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : t("signup.create")}
                    {!loading && <ArrowRight className="w-4 h-4 rtl:rotate-180" />}
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="mb-8">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em] font-mono mb-3">
                    {t("signup.step4")}
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-muted-foreground text-[15px]">
                    Please enter the 8-digit code we sent to {email}
                  </p>
                </div>

                {error && step === 4 && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-medium text-foreground mb-2 font-mono uppercase tracking-wider">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="12345678"
                      className="w-full h-14 px-4 bg-background border-2 border-border text-foreground text-[28px] tracking-[0.4em] font-bold text-center placeholder:text-muted-foreground/20 focus:outline-none focus:border-foreground transition-colors font-mono"
                    />
                  </div>

                  <button 
                    disabled={loading || otpCode.length < 8}
                    onClick={handleVerifyOtp} 
                    className="w-full h-12 flex items-center justify-center gap-2 bg-foreground text-background font-medium text-[15px] hover:bg-foreground/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Complete Registration"}
                    {!loading && <Check className="w-4 h-4" />}
                  </button>

                  <p className="text-center text-[13px] text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button 
                      onClick={handleSignup}
                      className="text-foreground font-medium hover:underline"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </>
            )}

            {(step === 1 || step === 2 || step === 3) && (
              <>
                <div className="flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">{t("signup.or")}</span>
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
                  {t("signup.has_account")}{" "}
                  <Link to="/login" className="text-foreground font-medium hover:underline">
                    {t("signup.signin_link")}
                  </Link>
                </p>
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

export default Signup;
