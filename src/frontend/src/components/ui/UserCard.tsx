import { createActor } from "@/backend";
import type { UserProfile } from "@/lib/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import GlassCard from "./GlassCard";
import GradientButton from "./GradientButton";
import UserAvatar from "./UserAvatar";

interface Props {
  user: UserProfile;
  isFollowing?: boolean;
  showFollowButton?: boolean;
  index?: number;
}

export default function UserCard({
  user,
  isFollowing = false,
  showFollowButton = true,
  index = 0,
}: Props) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (!actor) return;
    setLoading(true);
    try {
      if (following) {
        await actor.unfollowUser(user.id);
        setFollowing(false);
        toast.success(`Unfollowed @${user.username}`);
      } else {
        await actor.followUser(user.id);
        setFollowing(true);
        toast.success(`Following @${user.username}`);
      }
      qc.invalidateQueries({ queryKey: ["suggested-users"] });
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      data-ocid={`user_card.item.${index + 1}`}
    >
      <GlassCard hover glow="purple" className="p-4">
        <div className="flex items-center gap-3">
          <Link
            to="/profile/$userId"
            params={{ userId: user.id.toString() }}
            data-ocid={`user_card.profile_link.${index + 1}`}
          >
            <UserAvatar
              src={user.avatarUrl}
              name={user.displayName}
              size="md"
              ring
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link to="/profile/$userId" params={{ userId: user.id.toString() }}>
              <p className="truncate text-sm font-semibold text-foreground hover:text-primary transition-neon">
                {user.displayName}
              </p>
            </Link>
            <p className="truncate text-xs text-muted-foreground">
              @{user.username}
            </p>
            {user.bio && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                {user.bio}
              </p>
            )}
          </div>
          {showFollowButton && (
            <GradientButton
              variant={following ? "outline" : "primary"}
              size="sm"
              loading={loading}
              onClick={handleFollow}
              data-ocid={`user_card.follow_button.${index + 1}`}
            >
              {following ? "Following" : "Follow"}
            </GradientButton>
          )}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">
              {user.followersCount.toString()}
            </strong>{" "}
            followers
          </span>
          <span>
            <strong className="text-foreground">
              {user.followingCount.toString()}
            </strong>{" "}
            following
          </span>
          <span>
            <strong className="text-foreground">
              {user.postsCount.toString()}
            </strong>{" "}
            posts
          </span>
        </div>
        {user.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {user.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
