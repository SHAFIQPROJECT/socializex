import type { UserProfile } from "@/backend";
import { useFollowUser } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { UserCheck, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

function formatCount(n: bigint): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

interface UserCardProps {
  user: UserProfile;
  index?: number;
  compact?: boolean;
}

export default function UserCard({
  user,
  index = 0,
  compact = false,
}: UserCardProps) {
  const [following, setFollowing] = useState(false);
  const followUser = useFollowUser();

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    setFollowing((f) => !f);
    followUser.mutate({ uid: user.id.toString(), isFollowing: following });
  };

  const initials = user.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.06 }}
        className="flex items-center justify-between gap-2 py-2"
        data-ocid={`users.item.${index + 1}`}
      >
        <Link
          to="/profile/$userId"
          params={{ userId: user.id.toString() }}
          className="flex items-center gap-2 min-w-0 flex-1"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-primary/20"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user.displayName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={handleFollow}
          className={`shrink-0 rounded-lg px-3 py-1 text-xs font-semibold transition-neon ${
            following
              ? "border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              : "gradient-primary text-primary-foreground"
          }`}
          data-ocid={`users.follow_button.${index + 1}`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ delay: index * 0.06 }}
      className="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-3"
      data-ocid={`users.item.${index + 1}`}
    >
      <Link
        to="/profile/$userId"
        params={{ userId: user.id.toString() }}
        className="flex flex-col items-center gap-2"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary text-lg font-bold ring-2 ring-primary/30">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground truncate max-w-[10ch]">
            {user.displayName}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[12ch]">
            @{user.username}
          </p>
        </div>
      </Link>
      <div className="flex gap-3 text-center text-xs text-muted-foreground">
        <div>
          <p className="font-semibold text-foreground text-sm">
            {formatCount(user.followersCount)}
          </p>
          <p>followers</p>
        </div>
        <div className="w-px bg-border" />
        <div>
          <p className="font-semibold text-foreground text-sm">
            {formatCount(user.postsCount)}
          </p>
          <p>posts</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleFollow}
        className={`w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-neon ${
          following
            ? "border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive"
            : "gradient-primary text-primary-foreground"
        }`}
        data-ocid={`users.follow_button.${index + 1}`}
      >
        {following ? <UserCheck size={15} /> : <UserPlus size={15} />}
        {following ? "Following" : "Follow"}
      </button>
    </motion.div>
  );
}
