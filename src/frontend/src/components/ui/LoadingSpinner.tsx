import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface Props {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 24,
  md: 36,
  lg: 56,
};

export default function LoadingSpinner({ size = "md", className }: Props) {
  const px = sizeMap[size];
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      className={cn("shrink-0", className)}
      style={{ width: px, height: px }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 36 36"
        fill="none"
        role="img"
        aria-label="Loading"
      >
        <circle
          cx="18"
          cy="18"
          r="14"
          stroke="oklch(0.55 0.22 280 / 0.15)"
          strokeWidth="3"
        />
        <path
          d="M18 4 A14 14 0 0 1 32 18"
          stroke="url(#spinner-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="spinner-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.22 280)" />
            <stop offset="100%" stopColor="oklch(0.58 0.22 330)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
