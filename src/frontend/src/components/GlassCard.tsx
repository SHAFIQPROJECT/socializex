import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: "purple" | "cyan" | "pink" | "none";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { children, className, glow = "none", ...props },
  ref,
) {
  const glowClass =
    glow === "purple"
      ? "neon-glow-purple"
      : glow === "cyan"
        ? "neon-glow-cyan"
        : glow === "pink"
          ? "neon-glow-pink"
          : "";

  return (
    <div
      ref={ref}
      className={cn("glass-card rounded-2xl", glowClass, className)}
      {...props}
    >
      {children}
    </div>
  );
});

export default GlassCard;
