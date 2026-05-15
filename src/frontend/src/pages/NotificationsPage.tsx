import { createActor } from "@/backend";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { useNotifications } from "@/hooks/useQueries";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const TYPE_ICON: Record<string, React.ElementType> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
};

const TYPE_COLOR: Record<string, string> = {
  like: "text-red-400",
  comment: "text-secondary",
  follow: "text-primary",
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  async function markAllRead() {
    if (!actor) return;
    try {
      await actor.markAllNotificationsRead();
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread-count"] });
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Bell size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
        </motion.div>
        {notifications && notifications.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-neon"
            data-ocid="notifications.mark_all_read_button"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </div>

      <div className="space-y-2" data-ocid="notifications.list">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {!isLoading && (!notifications || notifications.length === 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="notifications.empty_state"
          >
            <p className="text-4xl mb-3">🔔</p>
            <h3 className="font-semibold text-foreground mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-muted-foreground">
              No new notifications.
            </p>
          </div>
        )}

        {notifications?.map((notif, i) => {
          const Icon = TYPE_ICON[notif.notifType] ?? Bell;
          const color = TYPE_COLOR[notif.notifType] ?? "text-muted-foreground";
          return (
            <motion.div
              key={notif.id.toString()}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-xl p-4 flex items-center gap-3 ${
                !notif.isRead ? "border-primary/30" : "border-border/20"
              } transition-neon`}
              data-ocid={`notifications.item.${i + 1}`}
            >
              <div className={`shrink-0 ${color}`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{notif.notifType}</span>{" "}
                  <span className="text-muted-foreground">
                    · {notif.entityId}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(
                    new Date(Number(notif.createdAt) / 1_000_000),
                    { addSuffix: true },
                  )}
                </p>
              </div>
              {!notif.isRead && (
                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
