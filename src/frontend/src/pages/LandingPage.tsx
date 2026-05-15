import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  ChevronLeft,
  ChevronRight,
  Github,
  Globe,
  Instagram,
  Lock,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ---------- Animated Counter ----------
function AnimatedCounter({
  target,
  suffix = "",
}: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ---------- Data ----------
const FEATURES = [
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    description:
      "Instant messaging with live presence, typing indicators, and read receipts.",
    color: "purple" as const,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description:
      "Smart captions, toxic content detection, and personalized feed ranking.",
    color: "cyan" as const,
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: Sparkles,
    title: "Premium UI",
    description:
      "Dark glassmorphism design with fluid animations and neon accents throughout.",
    color: "pink" as const,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Shield,
    title: "Secure",
    description:
      "End-to-end encryption, rate limiting, and Internet Identity authentication.",
    color: "purple" as const,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Sub-second loads with lazy loading, code splitting, and optimized delivery.",
    color: "cyan" as const,
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: Globe,
    title: "Community",
    description:
      "Connect with creators, discover trending content, and grow your audience.",
    color: "pink" as const,
    gradient: "from-accent/20 to-accent/5",
  },
];

const STATS = [
  { value: 10, suffix: "M+", label: "Active Users" },
  { value: 50, suffix: "M+", label: "Posts Shared" },
  { value: 100, suffix: "+", label: "Countries" },
  { value: 99, suffix: ".9%", label: "Uptime" },
];

const TESTIMONIALS = [
  {
    name: "Aria Chen",
    handle: "@aria_creates",
    avatar: "AC",
    role: "Digital Artist",
    text: "SocializeX changed how I share my art. The AI captioning is mind-blowing and the community is incredibly supportive.",
  },
  {
    name: "Marcus Webb",
    handle: "@mwebb_dev",
    avatar: "MW",
    role: "Full-Stack Engineer",
    text: "The realtime chat and notifications are buttery smooth. Best social platform I've used — the dark UI is stunning.",
  },
  {
    name: "Zoe Okafor",
    handle: "@zoe.builds",
    avatar: "ZO",
    role: "Product Designer",
    text: "Finally a platform that takes design seriously. The glassmorphism and animations are on another level.",
  },
  {
    name: "Liam Torres",
    handle: "@liamtorres",
    avatar: "LT",
    role: "Content Creator",
    text: "Grew from 0 to 50K followers in 3 months. The AI recommendations brought the right audience to my content.",
  },
];

// ---------- Orb component ----------
function Orb({ className }: { className: string }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute rounded-full blur-[80px] ${className}`}
    />
  );
}

// ---------- Section animation wrapper ----------
function FadeUp({
  children,
  delay = 0,
  className = "",
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------- Testimonial carousel ----------
function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const prev = () =>
    setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIdx((i) => (i + 1) % TESTIMONIALS.length);

  useEffect(() => {
    const id = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  const t = TESTIMONIALS[idx];

  return (
    <div
      className="relative flex flex-col items-center"
      data-ocid="testimonials.section"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <GlassCard className="p-8" glow="purple">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                {t.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <span className="text-xs text-muted-foreground">
                    {t.handle}
                  </span>
                </div>
                <p className="text-xs text-secondary mb-3">{t.role}</p>
                <div className="mb-4 flex gap-1">
                  {["s1", "s2", "s3", "s4", "s5"].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className="fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-neon"
          data-ocid="testimonials.prev_button"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
              data-ocid={`testimonials.dot.${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next testimonial"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-neon"
          data-ocid="testimonials.next_button"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------- Main Page ----------
export default function LandingPage() {
  return (
    <div
      className="relative overflow-hidden bg-background"
      data-ocid="landing.page"
    >
      {/* Global background orbs */}
      <Orb className="top-[-10%] left-[-5%] h-[500px] w-[500px] bg-primary/25" />
      <Orb className="top-[20%] right-[-8%] h-[400px] w-[400px] bg-secondary/20" />
      <Orb className="bottom-[10%] left-[30%] h-[350px] w-[350px] bg-accent/15" />

      {/* ====== HERO ====== */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 text-center"
        data-ocid="landing.hero_section"
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary"
        >
          <Sparkles size={14} className="animate-pulse" />
          <span>The Next-Gen Social Platform is here</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl font-bold leading-tight tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="text-gradient">Socialize</span>
          <span className="text-foreground">X</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-4 max-w-2xl text-xl text-muted-foreground sm:text-2xl"
        >
          The Future of Social —{" "}
          <span className="text-foreground font-medium">AI-powered</span>,
          real-time, and beautifully crafted.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-4"
        >
          <Link to="/login" data-ocid="hero.join_button">
            <GradientButton size="lg" className="gap-2 px-8">
              Join Now <ArrowRight size={18} />
            </GradientButton>
          </Link>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            data-ocid="hero.demo_button"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-border/50 px-7 text-base text-muted-foreground backdrop-blur-sm transition-neon hover:border-primary/40 hover:text-foreground"
          >
            Explore Features
          </button>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-16 w-full max-w-4xl"
        >
          <GlassCard className="overflow-hidden" glow="purple">
            <img
              src="/assets/generated/hero-socializex.dim_1200x600.jpg"
              alt="SocializeX platform preview"
              className="w-full object-cover h-64 sm:h-80 lg:h-96"
            />
          </GlassCard>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="h-6 w-3.5 rounded-full border border-muted-foreground/30 flex items-start justify-center pt-1"
          >
            <div className="h-1.5 w-1 rounded-full bg-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ====== STATS ====== */}
      <section className="bg-muted/20 py-16" data-ocid="landing.stats_section">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1}>
                <GlassCard className="p-6 text-center" glow="purple">
                  <p className="text-4xl font-bold text-gradient">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {s.label}
                  </p>
                </GlassCard>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section
        id="features"
        className="py-24 px-4"
        data-ocid="landing.features_section"
      >
        <div className="mx-auto max-w-6xl">
          <FadeUp className="text-center mb-14">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Why SocializeX?
            </p>
            <h2 className="text-4xl font-bold sm:text-5xl">
              Everything you need to{" "}
              <span className="text-gradient">connect</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
              A full-stack social experience built for creators, communities,
              and conversations.
            </p>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <FadeUp key={feat.title} delay={i * 0.1} className="h-full">
                  <GlassCard hover glow={feat.color} className="h-full p-6">
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.gradient}`}
                    >
                      <Icon
                        size={22}
                        className={
                          feat.color === "purple"
                            ? "text-primary"
                            : feat.color === "cyan"
                              ? "text-secondary"
                              : "text-accent"
                        }
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </GlassCard>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section
        className="bg-muted/20 py-24 px-4"
        data-ocid="landing.testimonials_section"
      >
        <div className="mx-auto max-w-3xl">
          <FadeUp className="text-center mb-12">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
              Community Love
            </p>
            <h2 className="text-4xl font-bold">
              Loved by <span className="text-gradient">creators</span> worldwide
            </h2>
          </FadeUp>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ====== TRUST BAR ====== */}
      <section className="py-16 px-4" data-ocid="landing.trust_section">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Lock,
                title: "Privacy First",
                desc: "Your data is yours. End-to-end encrypted chats and full control.",
              },
              {
                icon: TrendingUp,
                title: "Grow Faster",
                desc: "AI-driven recommendations put your content in front of the right people.",
              },
              {
                icon: Users,
                title: "Real Community",
                desc: "Anti-spam AI and moderation keep the platform safe and genuine.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={i * 0.15}>
                  <div className="flex flex-col items-center text-center gap-3 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={26} />
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section
        className="relative py-28 px-4 overflow-hidden"
        data-ocid="landing.cta_section"
      >
        <Orb className="top-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-primary/20" />
        <div className="relative mx-auto max-w-2xl text-center">
          <FadeUp>
            <h2 className="text-4xl font-bold sm:text-5xl">
              Ready to join the <span className="text-gradient">future</span>?
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Start your journey on SocializeX today — free, fast, and
              futuristic.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/login" data-ocid="cta.join_button">
                <GradientButton size="lg" className="gap-2 px-10">
                  Get Started Free <ArrowRight size={18} />
                </GradientButton>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer
        className="border-t border-border/30 bg-card/50 py-12 px-4"
        data-ocid="landing.footer"
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold">
                SX
              </div>
              <span className="gradient-text text-xl font-bold">
                SocializeX
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Privacy", "Terms", "Support", "Blog"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="hover:text-foreground transition-neon"
                >
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Github, label: "GitHub" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href={"https://socializex.app"}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary transition-neon"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-border/20 pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} SocializeX. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
