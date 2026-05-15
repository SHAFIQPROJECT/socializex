import { createActor } from "@/backend";
import SkeletonCard from "@/components/ui/SkeletonCard";
import UserAvatar from "@/components/ui/UserAvatar";
import {
  useAdminPosts,
  useAdminStats,
  useAdminUsers,
} from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  BarChart2,
  FileText,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function AdminPage() {
  const { data: stats } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: posts, isLoading: postsLoading } = useAdminPosts();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  async function handleBan(target: string, ban: boolean) {
    if (!actor) return;
    try {
      const principal = (
        await import("@icp-sdk/core/principal")
      ).Principal.fromText(target);
      if (ban) {
        await actor.banUser(principal);
        toast.success("User banned");
      } else {
        await actor.unbanUser(principal);
        toast.success("User unbanned");
      }
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    } catch {
      toast.error("Action failed");
    }
  }

  async function handleDeletePost(postId: bigint) {
    if (!actor) return;
    try {
      await actor.adminDeletePost(postId);
      toast.success("Post removed");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    } catch {
      toast.error("Failed to delete post");
    }
  }

  const statCards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers.toString(),
          icon: Users,
          color: "text-primary",
        },
        {
          label: "Total Posts",
          value: stats.totalPosts.toString(),
          icon: FileText,
          color: "text-secondary",
        },
        {
          label: "Total Comments",
          value: stats.totalComments.toString(),
          icon: MessageSquare,
          color: "text-accent",
        },
        {
          label: "Active Chats",
          value: stats.activeConversations.toString(),
          icon: BarChart2,
          color: "text-chart-4",
        },
        {
          label: "Total Reports",
          value: stats.totalReports.toString(),
          icon: Shield,
          color: "text-destructive",
        },
        {
          label: "Banned Users",
          value: stats.bannedUsers.toString(),
          icon: Ban,
          color: "text-destructive",
        },
      ]
    : [];

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-2"
      >
        <Shield size={22} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card rounded-2xl p-4"
            data-ocid={`admin.stat.${i + 1}`}
          >
            <div className={`mb-2 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Users table */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <h2 className="font-semibold text-foreground mb-4">User Management</h2>
        <div className="space-y-2" data-ocid="admin.users_list">
          {usersLoading &&
            ["a0", "a1", "a2"].map((k) => <SkeletonCard key={k} />)}
          {users?.map((u, i) => (
            <div
              key={u.id.toString()}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/30 transition-neon"
              data-ocid={`admin.user.item.${i + 1}`}
            >
              <UserAvatar src={u.avatarUrl} name={u.displayName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {u.displayName}
                </p>
                <p className="text-xs text-muted-foreground">@{u.username}</p>
              </div>
              {u.isBanned && (
                <span className="text-xs text-destructive bg-destructive/10 rounded-full px-2 py-0.5">
                  Banned
                </span>
              )}
              <button
                type="button"
                onClick={() => handleBan(u.id.toString(), !u.isBanned)}
                className={`text-xs rounded-lg px-3 py-1.5 transition-neon ${
                  u.isBanned
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                }`}
                data-ocid={`admin.ban_button.${i + 1}`}
              >
                {u.isBanned ? "Unban" : "Ban"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Posts table */}
      <div className="glass-card rounded-2xl p-4">
        <h2 className="font-semibold text-foreground mb-4">Post Moderation</h2>
        <div className="space-y-2" data-ocid="admin.posts_list">
          {postsLoading &&
            ["p0", "p1", "p2"].map((k) => <SkeletonCard key={k} />)}
          {posts?.map((p, i) => (
            <div
              key={p.id.toString()}
              className="flex items-start gap-3 rounded-xl p-3 hover:bg-muted/30 transition-neon"
              data-ocid={`admin.post.item.${i + 1}`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground line-clamp-2">
                  {p.content}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {p.hashtags.map((t) => `#${t}`).join(" ")} ·{" "}
                  {p.likesCount.toString()} likes
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeletePost(p.id)}
                className="shrink-0 text-xs rounded-lg px-3 py-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-neon"
                data-ocid={`admin.delete_post_button.${i + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
