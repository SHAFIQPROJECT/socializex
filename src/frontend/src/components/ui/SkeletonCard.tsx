import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

function SkeletonLine({
  width = "full",
}: { width?: "full" | "3/4" | "1/2" | "1/3" }) {
  return (
    <div
      className={cn(
        "h-3 rounded-full bg-muted animate-shimmer",
        width === "full"
          ? "w-full"
          : width === "3/4"
            ? "w-3/4"
            : width === "1/2"
              ? "w-1/2"
              : "w-1/3",
      )}
      style={{
        background:
          "linear-gradient(90deg, oklch(0.14 0.01 280) 25%, oklch(0.18 0.015 280) 50%, oklch(0.14 0.01 280) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s ease-in-out infinite",
      }}
    />
  );
}

export default function SkeletonCard({
  className,
  lines = 3,
  showAvatar = true,
}: Props) {
  return (
    <div className={cn("glass-card rounded-2xl p-4 space-y-4", className)}>
      {showAvatar && (
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full shrink-0"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.14 0.01 280) 25%, oklch(0.18 0.015 280) 50%, oklch(0.14 0.01 280) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.8s ease-in-out infinite",
            }}
          />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="1/2" />
            <SkeletonLine width="1/3" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional
            key={`line-${i}`}
            width={i === lines - 1 ? "3/4" : "full"}
          />
        ))}
      </div>
    </div>
  );
}
