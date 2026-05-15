import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { forwardRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: "purple" | "cyan" | "pink" | "none";
  children: React.ReactNode;
  animate?: boolean;
}

const glowMap = {
  purple: "hover:neon-glow-purple hover:border-primary/40",
  cyan: "hover:neon-glow-cyan hover:border-secondary/40",
  pink: "hover:neon-glow-pink hover:border-accent/40",
  none: "",
};

const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  {
    hover = false,
    glow = "none",
    animate = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const classes = cn(
    "glass-card rounded-2xl transition-neon",
    hover && "cursor-pointer hover:bg-card/70",
    glow !== "none" && glowMap[glow],
    className,
  );

  if (animate) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className={classes}
        {...(props as React.ComponentPropsWithRef<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

export default GlassCard;
