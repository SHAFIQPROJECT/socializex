import { motion } from "motion/react";

const shimmer = {
  animate: { backgroundPosition: ["200% 0", "-200% 0"] },
  transition: {
    duration: 2.5,
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear" as const,
  },
};

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <motion.div
      {...shimmer}
      className={`rounded-lg bg-muted/60 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, oklch(var(--muted)/0.4) 25%, oklch(var(--muted)/0.8) 50%, oklch(var(--muted)/0.4) 75%)",
        backgroundSize: "400% 100%",
      }}
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonLine className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-3.5 w-28" />
          <SkeletonLine className="h-3 w-20" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonLine className="h-3.5 w-full" />
        <SkeletonLine className="h-3.5 w-4/5" />
        <SkeletonLine className="h-3.5 w-3/5" />
      </div>
      <SkeletonLine className="h-40 w-full rounded-xl" />
      <div className="flex gap-4">
        <SkeletonLine className="h-8 w-16" />
        <SkeletonLine className="h-8 w-16" />
        <SkeletonLine className="h-8 w-16" />
      </div>
    </div>
  );
}

export function UserSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <SkeletonLine className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonLine className="h-3.5 w-24" />
          <SkeletonLine className="h-3 w-16" />
        </div>
        <SkeletonLine className="h-7 w-16 rounded-lg" />
      </div>
    );
  }
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3">
      <SkeletonLine className="h-14 w-14 rounded-full" />
      <SkeletonLine className="h-3.5 w-20" />
      <SkeletonLine className="h-3 w-16" />
      <SkeletonLine className="h-8 w-full rounded-xl" />
    </div>
  );
}

export function ExploreSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <SkeletonLine className="aspect-square w-full" />
    </div>
  );
}

export default PostSkeleton;
