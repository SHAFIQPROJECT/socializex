import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { forwardRef } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "cyan" | "pink" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: "gradient-primary text-primary-foreground font-semibold",
  cyan: "bg-gradient-to-r from-secondary to-primary text-primary-foreground font-semibold",
  pink: "bg-gradient-to-r from-accent to-primary text-primary-foreground font-semibold",
  outline:
    "border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-neon font-medium",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-neon font-medium",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs rounded-lg",
  md: "h-10 px-5 text-sm rounded-xl",
  lg: "h-12 px-7 text-base rounded-xl",
};

const GradientButton = forwardRef<HTMLButtonElement, Props>(
  function GradientButton(
    {
      variant = "primary",
      size = "md",
      loading,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...(props as React.ComponentPropsWithRef<typeof motion.button>)}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            role="img"
            aria-label="Loading"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.2"
            />
            <path
              d="M12 2 A10 10 0 0 1 22 12"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);

export default GradientButton;
