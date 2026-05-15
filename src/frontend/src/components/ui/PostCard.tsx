import { createActor } from "@/backend";
import type { Post, UserProfile } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import GlassCard from "./GlassCard";
import UserAvatar from "./UserAvatar";

interface Props {
  post: Post;
  author?: UserProfile | null;
  isLiked?: boolean;
  isSaved?: boolean;
  onDelete?: (id: bigint) => void;
  index?: number;
}

export default function PostCard({
  post,
  author,
  isLiked = false,
  isSaved = false,
  onDelete,
  index = 0,
}: Props) {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(Number(post.likesCount));
  const [saved, setSaved] = useState(isSaved);
  const [showMenu, setShowMenu] = useState(false);

  async function handleLike() {
    if (!actor) return;
    try {
      if (liked) {
        await actor.unlikePost(post.id);
        setLiked(false);
        setLikeCount((c) => c - 1);
      } else {
        await actor.likePost(post.id);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch {
      toast.error("Like failed");
    }
  }

  async function handleSave() {
    if (!actor) return;
    try {
      if (saved) {
        await actor.unsavePost(post.id);
        setSaved(false);
        toast.success("Removed from saved");
      } else {
        await actor.savePost(post.id);
        setSaved(true);
        toast.success("Post saved");
      }
      qc.invalidateQueries({ queryKey: ["saved-posts"] });
    } catch {
      toast.error("Save failed");
    }
  }

  async function handleDelete() {
    if (!actor) return;
    try {
      await actor.deletePost(post.id);
      onDelete?.(post.id);
      toast.success("Post deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  const timeAgo = formatDistanceToNow(
    new Date(Number(post.createdAt) / 1_000_000),
    { addSuffix: true },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      data-ocid={`post.item.${index + 1}`}
    >
      <GlassCard className="p-4" hover glow="purple">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar
              src={author?.avatarUrl}
              name={author?.displayName ?? post.authorId.toString()}
              size="sm"
              online
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">
                {author?.displayName ?? "Unknown User"}
              </p>
              <p className="text-xs text-muted-foreground">
                @{author?.username ?? "unknown"} · {timeAgo}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-neon"
              data-ocid={`post.menu_button.${index + 1}`}
            >
              <MoreHorizontal size={16} />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-20 mt-1 w-36 glass-card rounded-xl border border-border/50 overflow-hidden"
                  data-ocid={`post.dropdown_menu.${index + 1}`}
                >
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-neon"
                      data-ocid={`post.delete_button.${index + 1}`}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleSave();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition-neon"
                  >
                    <Bookmark size={14} />
                    {saved ? "Unsave" : "Save"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed text-foreground/90 mb-3 whitespace-pre-wrap break-words">
          {post.content}
        </p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-primary hover:text-primary/80 cursor-pointer transition-neon"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {post.imageUrls.length > 0 && (
          <div
            className={cn(
              "mb-3 grid gap-2 rounded-xl overflow-hidden",
              post.imageUrls.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {post.imageUrls.slice(0, 4).map((url, i) => (
              <img
                key={url}
                src={url}
                alt={`Media ${i + 1}`}
                className="w-full aspect-video object-cover"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-border/30">
          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition-neon",
              liked
                ? "text-red-400 bg-red-500/10"
                : "text-muted-foreground hover:text-red-400 hover:bg-red-500/10",
            )}
            data-ocid={`post.like_button.${index + 1}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </motion.button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-neon"
            data-ocid={`post.comment_button.${index + 1}`}
          >
            <MessageCircle size={16} />
            <span>{Number(post.commentsCount)}</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm text-muted-foreground hover:text-accent hover:bg-accent/10 transition-neon"
            data-ocid={`post.share_button.${index + 1}`}
          >
            <Share2 size={16} />
          </button>

          <div className="flex-1" />

          <motion.button
            type="button"
            whileTap={{ scale: 0.85 }}
            onClick={handleSave}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-sm transition-neon",
              saved
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10",
            )}
            data-ocid={`post.save_button.${index + 1}`}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
