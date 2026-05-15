import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  name?: string;
  online?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}

const sizeMap = {
  xs: "h-7 w-7 text-xs",
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

const dotSize = {
  xs: "h-2 w-2 bottom-0 right-0",
  sm: "h-2.5 w-2.5 bottom-0 right-0",
  md: "h-3 w-3 bottom-0.5 right-0.5",
  lg: "h-3.5 w-3.5 bottom-0.5 right-0.5",
  xl: "h-4 w-4 bottom-1 right-1",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function UserAvatar({
  src,
  name,
  online,
  size = "md",
  className,
  ring,
}: Props) {
  return (
    <div className={cn("relative shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name ?? "Avatar"}
          className={cn(
            "rounded-full object-cover",
            sizeMap[size],
            ring &&
              "ring-2 ring-primary/60 ring-offset-1 ring-offset-background",
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-semibold bg-primary/20 text-primary",
            sizeMap[size],
            ring &&
              "ring-2 ring-primary/60 ring-offset-1 ring-offset-background",
          )}
        >
          {name ? getInitials(name) : "?"}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-background",
            online ? "bg-green-500" : "bg-muted-foreground/40",
            dotSize[size],
          )}
        />
      )}
    </div>
  );
}
