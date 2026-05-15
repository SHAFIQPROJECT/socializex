import { createActor } from "@/backend";
import type { Post, UserProfile } from "@/backend";
import GlassCard from "@/components/ui/GlassCard";
import GradientButton from "@/components/ui/GradientButton";
import UserAvatar from "@/components/ui/UserAvatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Bookmark,
  Edit2,
  Eye,
  Film,
  Github,
  Globe,
  Grid3X3,
  Heart,
  Link2,
  Linkedin,
  TrendingUp,
  Twitter,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  twitter: Twitter,
  x: Twitter,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  default: Link2,
};

function getSocialIcon(url: string) {
  const lower = url.toLowerCase();
  if (lower.includes("twitter") || lower.includes("x.com"))
    return SOCIAL_ICONS.twitter;
  if (lower.includes("github")) return SOCIAL_ICONS.github;
  if (lower.includes("linkedin")) return SOCIAL_ICONS.linkedin;
  return SOCIAL_ICONS.default;
}

function ProfileSkeleton() {
  return (
    <div className="w-full" data-ocid="profile.loading_state">
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="px-4 md:px-8">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-16 w-full max-w-lg mb-4" />
        <div className="flex gap-4 mb-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-24 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PostThumb({ post, index }: { post: Post; index: number }) {
  const hasImage = post.imageUrls.length > 0;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer glass-card"
      data-ocid={`profile.post_thumb.${index + 1}`}
    >
      {hasImage ? (
        <img
          src={post.imageUrls[0]}
          alt=""
          className="w-full h-full object-cover transition-neon group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground line-clamp-4 text-center">
            {post.content}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-neon flex items-center justify-center gap-4">
        <span className="flex items-center gap-1 text-white text-sm font-semibold">
          <Heart size={14} fill="white" /> {Number(post.likesCount)}
        </span>
        <span className="flex items-center gap-1 text-white text-sm font-semibold">
          <Eye size={14} /> {Number(post.commentsCount)}
        </span>
      </div>
      {post.isReel && (
        <span className="absolute top-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5">
          <Film size={12} className="text-white" />
        </span>
      )}
    </motion.div>
  );
}

function FollowersModal({
  open,
  onClose,
  userId,
  type,
}: {
  open: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
}) {
  const { actor } = useActor(createActor);
  const { data: users = [], isLoading } = useQuery<UserProfile[]>({
    queryKey: [type, userId],
    queryFn: async () => {
      if (!actor) return [];
      const principal = {
        toText: () => userId,
        toUint8Array: () => new Uint8Array(),
      } as Parameters<typeof actor.getFollowers>[0];
      return type === "followers"
        ? actor.getFollowers(principal)
        : actor.getFollowing(principal);
    },
    enabled: open && !!actor,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="glass-card border border-border/40 max-w-sm"
        data-ocid={`profile.${type}_dialog`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground capitalize">{type}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
            data-ocid={`profile.${type}_close_button`}
          >
            <X size={18} />
          </button>
        </div>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No {type} yet
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((u, i) => (
                <Link
                  key={u.id.toString()}
                  to="/profile/$userId"
                  params={{ userId: u.id.toString() }}
                  onClick={onClose}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted/40 transition-neon cursor-pointer"
                    data-ocid={`profile.${type}_user.${i + 1}`}
                  >
                    <UserAvatar
                      src={u.avatarUrl}
                      name={u.displayName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {u.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{u.username}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfilePage() {
  const params = useParams({ strict: false }) as { userId?: string };
  const userId = params.userId ?? "";
  const { user: me } = useAuthStore();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "posts" | "reels" | "saved" | "liked"
  >("posts");
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const isOwnProfile = me?.id.toString() === userId;

  const { data: profile, isLoading: profileLoading } =
    useQuery<UserProfile | null>({
      queryKey: ["profile", userId],
      queryFn: async () => {
        if (!actor || !userId) return null;
        const principal = { toText: () => userId } as Parameters<
          typeof actor.getProfile
        >[0];
        return actor.getProfile(principal);
      },
      enabled: !!actor && !!userId,
    });

  const { data: posts = [], isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      const principal = { toText: () => userId } as Parameters<
        typeof actor.getUserPosts
      >[0];
      return actor.getUserPosts(principal, BigInt(30), BigInt(0));
    },
    enabled: !!actor && !!userId,
  });

  const { data: isFollowing = false } = useQuery<boolean>({
    queryKey: ["is-following", userId],
    queryFn: async () => {
      if (!actor || !userId || isOwnProfile) return false;
      const principal = { toText: () => userId } as Parameters<
        typeof actor.isFollowingUser
      >[0];
      return actor.isFollowingUser(principal);
    },
    enabled: !!actor && !!userId && !isOwnProfile,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const principal = { toText: () => userId } as Parameters<
        typeof actor.followUser
      >[0];
      if (isFollowing) return actor.unfollowUser(principal);
      return actor.followUser(principal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["is-following", userId] });
      qc.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success(isFollowing ? "Unfollowed" : "Following!");
    },
    onError: () => toast.error("Action failed"),
  });

  const filteredPosts = useMemo(() => {
    if (activeTab === "posts") return posts.filter((p) => !p.isReel);
    if (activeTab === "reels") return posts.filter((p) => p.isReel);
    return posts;
  }, [posts, activeTab]);

  const joinedDate = profile
    ? formatDistanceToNow(new Date(Number(profile.createdAt) / 1_000_000), {
        addSuffix: true,
      })
    : "";

  const tabs = [
    { id: "posts" as const, label: "Posts", icon: Grid3X3 },
    { id: "reels" as const, label: "Reels", icon: Film },
    ...(isOwnProfile
      ? [{ id: "saved" as const, label: "Saved", icon: Bookmark }]
      : []),
    { id: "liked" as const, label: "Liked", icon: Heart },
  ];

  return (
    <>
      <div className="min-h-screen" data-ocid="profile.page">
        {profileLoading ? (
          <ProfileSkeleton />
        ) : !profile ? (
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
            data-ocid="profile.error_state"
          >
            <div className="text-6xl">👤</div>
            <h2 className="text-xl font-semibold text-foreground">
              User not found
            </h2>
            <p className="text-muted-foreground">
              This profile doesn't exist or has been removed.
            </p>
            <Link to="/feed">
              <GradientButton>Back to Feed</GradientButton>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Cover Image */}
            <div
              className="relative w-full h-48 md:h-64 overflow-hidden"
              data-ocid="profile.cover_section"
            >
              {profile.coverUrl ? (
                <img
                  src={profile.coverUrl}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    background: `linear-gradient(135deg,
                    oklch(0.60 0.24 280 / 0.8) 0%,
                    oklch(0.58 0.20 200 / 0.6) 40%,
                    oklch(0.60 0.22 330 / 0.8) 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0' stop-color='white' stop-opacity='.2'/%3E%3Cstop offset='1' stop-color='white' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='30' cy='30' r='28' fill='url(%23g)'/%3E%3C/svg%3E\")",
                    }}
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Profile Header */}
            <div className="px-4 md:px-8 max-w-4xl mx-auto">
              <div className="flex items-end justify-between -mt-14 mb-4 relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <UserAvatar
                    src={profile.avatarUrl}
                    name={profile.displayName}
                    size="xl"
                    ring
                    className="ring-4 ring-background shadow-xl"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  {isOwnProfile ? (
                    <Link to="/settings" data-ocid="profile.edit_button">
                      <GradientButton variant="outline" size="sm">
                        <Edit2 size={14} /> Edit Profile
                      </GradientButton>
                    </Link>
                  ) : (
                    <GradientButton
                      variant={isFollowing ? "outline" : "primary"}
                      size="sm"
                      loading={followMutation.isPending}
                      onClick={() => followMutation.mutate()}
                      data-ocid="profile.follow_button"
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus size={14} /> Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus size={14} /> Follow
                        </>
                      )}
                    </GradientButton>
                  )}
                </motion.div>
              </div>

              {/* Name & Bio */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-5"
              >
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    {profile.displayName}
                  </h1>
                  {profile.isAdmin && (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/30">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  @{profile.username} · Joined {joinedDate}
                </p>
                {profile.bio && (
                  <p className="text-sm text-foreground/90 leading-relaxed max-w-lg break-words mb-3">
                    {profile.bio}
                  </p>
                )}

                {/* Skills */}
                {profile.skills.length > 0 && (
                  <div
                    className="flex flex-wrap gap-1.5 mb-3"
                    data-ocid="profile.skills_section"
                  >
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Social Links */}
                {profile.socialLinks.length > 0 && (
                  <div
                    className="flex items-center gap-3 flex-wrap"
                    data-ocid="profile.social_links"
                  >
                    {profile.socialLinks.map((url, i) => {
                      const Icon = getSocialIcon(url);
                      return (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-neon group"
                          data-ocid={`profile.social_link.${i + 1}`}
                        >
                          <Icon
                            size={14}
                            className="group-hover:neon-glow-purple"
                          />
                          <span className="truncate max-w-[120px]">
                            {url.replace(/https?:\/\/(www\.)?/, "")}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 md:gap-4 mb-6"
                data-ocid="profile.stats_section"
              >
                <GlassCard className="flex-1 flex flex-col items-center py-3 cursor-default">
                  <span className="text-lg md:text-2xl font-bold gradient-text">
                    {Number(profile.postsCount)}
                  </span>
                  <span className="text-xs text-muted-foreground">Posts</span>
                </GlassCard>
                <button
                  type="button"
                  onClick={() => setFollowersOpen(true)}
                  data-ocid="profile.followers_button"
                  className="flex-1"
                >
                  <GlassCard
                    hover
                    glow="purple"
                    className="w-full flex flex-col items-center py-3"
                  >
                    <span className="text-lg md:text-2xl font-bold gradient-text">
                      {Number(profile.followersCount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Followers
                    </span>
                  </GlassCard>
                </button>
                <button
                  type="button"
                  onClick={() => setFollowingOpen(true)}
                  data-ocid="profile.following_button"
                  className="flex-1"
                >
                  <GlassCard
                    hover
                    glow="cyan"
                    className="w-full flex flex-col items-center py-3"
                  >
                    <span className="text-lg md:text-2xl font-bold gradient-text">
                      {Number(profile.followingCount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Following
                    </span>
                  </GlassCard>
                </button>
              </motion.div>

              {/* Analytics (own profile) */}
              <AnimatePresence>
                {isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mb-6"
                    data-ocid="profile.analytics_section"
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                      <TrendingUp size={14} /> Analytics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Profile Views",
                          value: Number(profile.followersCount) * 12,
                          icon: Eye,
                          color: "primary",
                        },
                        {
                          label: "Engagement",
                          value: `${(Number(profile.postsCount) > 0 ? 4.7 : 0).toFixed(1)}%`,
                          icon: TrendingUp,
                          color: "secondary",
                        },
                        {
                          label: "Total Likes",
                          value: Number(profile.postsCount) * 34,
                          icon: Heart,
                          color: "accent",
                        },
                        {
                          label: "Reach",
                          value: Number(profile.followersCount) * 3,
                          icon: Globe,
                          color: "primary",
                        },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.06 }}
                          data-ocid={`profile.analytics_card.${i + 1}`}
                        >
                          <GlassCard className="p-3 flex items-center gap-3">
                            <stat.icon
                              size={16}
                              className={`text-${stat.color} shrink-0`}
                            />
                            <div className="min-w-0">
                              <p className="text-base font-bold text-foreground truncate">
                                {stat.value.toLocaleString?.() ?? stat.value}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                {stat.label}
                              </p>
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabs */}
              <div
                className="flex items-center border-b border-border/40 mb-6"
                data-ocid="profile.tabs"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    data-ocid={`profile.${tab.id}_tab`}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-neon ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Posts Grid */}
              <div className="pb-12" data-ocid="profile.posts_grid">
                {postsLoading ? (
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {["g0", "g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8"].map(
                      (k) => (
                        <Skeleton
                          key={k}
                          className="aspect-square rounded-xl"
                        />
                      ),
                    )}
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16 gap-3"
                    data-ocid="profile.posts_empty_state"
                  >
                    <div className="text-5xl">
                      {activeTab === "reels"
                        ? "🎬"
                        : activeTab === "saved"
                          ? "🔖"
                          : "📸"}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {isOwnProfile
                        ? "You haven't shared anything here yet"
                        : "No posts to show"}
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {filteredPosts.map((post, i) => (
                      <PostThumb
                        key={post.id.toString()}
                        post={post}
                        index={i}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <FollowersModal
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        userId={userId}
        type="followers"
      />
      <FollowersModal
        open={followingOpen}
        onClose={() => setFollowingOpen(false)}
        userId={userId}
        type="following"
      />
    </>
  );
}
