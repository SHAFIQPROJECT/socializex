import { createActor } from "@/backend";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { useAuthStore } from "@/stores/authStore";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ArrowRight, Shield, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ---------- Orb background ----------
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: 7,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute rounded-full blur-[80px] ${className}`}
    />
  );
}

// ---------- Profile Setup Modal ----------
interface ProfileSetupProps {
  onComplete: (data: {
    username: string;
    displayName: string;
    bio: string;
  }) => void;
  onClose: () => void;
  isLoading: boolean;
}

function ProfileSetupModal({
  onComplete,
  onClose,
  isLoading,
}: ProfileSetupProps) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!username.trim() || username.length < 3)
      errs.username = "Username must be at least 3 characters";
    if (!/^[a-z0-9_]+$/.test(username))
      errs.username = "Only lowercase letters, numbers, and underscores";
    if (!displayName.trim() || displayName.length < 2)
      errs.displayName = "Display name must be at least 2 characters";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onComplete({
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      bio: bio.trim(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      data-ocid="profile_setup.dialog"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 relative" glow="purple">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-neon"
            data-ocid="profile_setup.close_button"
          >
            <X size={18} />
          </button>

          <div className="mb-6 flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Sparkles size={22} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Set Up Your Profile
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Almost there! Tell the community who you are.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  @
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((p) => ({ ...p, username: "" }));
                  }}
                  placeholder="your_handle"
                  className="w-full rounded-xl border border-border/50 bg-muted/30 py-2.5 pl-7 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-neon"
                  data-ocid="profile_setup.username_input"
                />
              </div>
              {errors.username && (
                <p
                  className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
                  data-ocid="profile_setup.username_field_error"
                >
                  <AlertCircle size={12} /> {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setErrors((p) => ({ ...p, displayName: "" }));
                }}
                placeholder="Your Full Name"
                className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-neon"
                data-ocid="profile_setup.displayname_input"
              />
              {errors.displayName && (
                <p
                  className="mt-1.5 flex items-center gap-1 text-xs text-destructive"
                  data-ocid="profile_setup.displayname_field_error"
                >
                  <AlertCircle size={12} /> {errors.displayName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Bio{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell the world about yourself..."
                rows={3}
                maxLength={160}
                className="w-full resize-none rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-neon"
                data-ocid="profile_setup.bio_textarea"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {bio.length}/160
              </p>
            </div>

            <GradientButton
              type="submit"
              size="lg"
              loading={isLoading}
              className="w-full"
              data-ocid="profile_setup.submit_button"
            >
              {isLoading ? "Saving..." : "Create Profile"}
            </GradientButton>
          </form>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ---------- Main Login Page ----------
export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity, isLoading: iiLoading } = useAuthStore();
  const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();
  const { actor } = useActor(createActor);

  const [showSetup, setShowSetup] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const isLoggingIn = iiLoading || loginStatus === "logging-in";

  // After II login, check if profile exists
  useEffect(() => {
    // Guard: no identity or actor yet — ensure loading is cleared
    if (!identity) return;
    if (!actor) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const checkProfile = async () => {
      setIsLoading(true);
      try {
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 10_000),
        );
        const profile = await Promise.race([actor.getMyProfile(), timeout]);
        if (cancelled) return;
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
          navigate({ to: "/feed" });
        } else {
          setShowSetup(true);
        }
      } catch (err) {
        if (cancelled) return;
        const isTimeout = err instanceof Error && err.message === "timeout";
        if (isTimeout) {
          toast.error("Connection timed out. Please try again.");
        } else {
          setShowSetup(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    checkProfile();
    return () => {
      cancelled = true;
    };
  }, [identity, actor, navigate, setIsLoading, setIsAuthenticated, setUser]);

  const handleProfileSetup = async (data: {
    username: string;
    displayName: string;
    bio: string;
  }) => {
    if (!actor) return;
    setSavingProfile(true);
    try {
      const ok = await actor.registerUser(data.username, data.displayName);
      if (ok) {
        // Fetch the newly created profile
        const profile = await actor.getMyProfile();
        if (profile) {
          // Update bio via updateProfile
          if (data.bio) {
            await actor.updateProfile(
              profile.displayName,
              data.bio,
              "",
              "",
              [],
              [],
            );
          }
          const updated = await actor.getMyProfile();
          setUser(updated ?? profile);
        }
        setIsAuthenticated(true);
        setShowSetup(false);
        toast.success("Welcome to SocializeX! 🎉");
        navigate({ to: "/feed" });
      } else {
        toast.error("Failed to create profile. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4"
      data-ocid="login.page"
    >
      {/* Background orbs */}
      <Orb className="top-[-5%] left-[-5%] h-[450px] w-[450px] bg-primary/25" />
      <Orb className="bottom-[-10%] right-[-5%] h-[380px] w-[380px] bg-secondary/20" />
      <Orb className="top-[50%] left-[50%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-accent/10" />

      <div className="relative w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Brand header */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary neon-glow-purple"
            >
              <span className="text-2xl font-bold">SX</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold">
                <span className="text-gradient">Socialize</span>
                <span className="text-foreground">X</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                The Future of Social
              </p>
            </motion.div>
          </div>

          {/* Login card */}
          <GlassCard animate glow="purple" className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-foreground">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in securely with Internet Identity
              </p>
            </div>

            <GradientButton
              size="lg"
              loading={isLoggingIn}
              className="w-full"
              onClick={() => login()}
              data-ocid="login.signin_button"
            >
              {isLoggingIn ? (
                "Connecting..."
              ) : (
                <>
                  <Shield size={18} />
                  Sign In with Internet Identity
                </>
              )}
            </GradientButton>

            <div className="mt-6">
              <GlassCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      What is Internet Identity?
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      A secure, anonymous authentication system by the Internet
                      Computer. No passwords, no data harvesting — just
                      cryptographic keys you control.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-xs text-muted-foreground">
                New to SocializeX?
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <div className="mt-4 rounded-xl border border-border/30 bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground text-center">
                No account needed — your Internet Identity{" "}
                <span className="text-foreground font-medium">is</span> your
                account. First sign-in creates your profile automatically.
              </p>
              <button
                type="button"
                onClick={() => login()}
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-neon font-medium"
                data-ocid="login.create_account_button"
              >
                Create my account <ArrowRight size={14} />
              </button>
            </div>
          </GlassCard>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            {[
              { icon: Shield, text: "Zero passwords" },
              { icon: Sparkles, text: "AI-powered" },
              { icon: Shield, text: "Open protocol" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon size={12} className="text-primary" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

          {/* Back to landing */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="text-sm text-muted-foreground hover:text-foreground transition-neon"
              data-ocid="login.back_button"
            >
              ← Back to home
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Profile Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <ProfileSetupModal
            onComplete={handleProfileSetup}
            onClose={() => setShowSetup(false)}
            isLoading={savingProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
