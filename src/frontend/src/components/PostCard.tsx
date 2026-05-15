import type { Post } from "@/backend";
import { useLikePost, useSavePost } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Play,
  Share2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const EMOJIS = ["❤️", "😂", "😮", "😢", "😡", "👍"];

function formatCount(n: bigint): string {
  const num = Number(n);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

function timeAgo(ts: bigint): string {
  const diffMs = Date.now() - Number(ts) / 1_000_000;
  const secs = Math.floor(diffMs / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

interface PostCardProps {
  post: Post;
  authorName?: string;
  authorUsername?: string;
  authorAvatar?: string;
  index?: number;
}

export default function PostCard({
  post,
  authorName = "SocializeX User",
  authorUsername = "user",
  authorAvatar = "",
  index = 0,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [localLikes, setLocalLikes] = useState(Number(post.likesCount));
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<string[]>([]);
  const likePost = useLikePost();
  const savePost = useSavePost();

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLocalLikes((p) => p + (newLiked ? 1 : -1));
    likePost.mutate({ postId: post.id, liked });
  };

  const handleSave = () => {
    setSaved((s) => !s);
    savePost.mutate({ postId: post.id, saved });
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/feed`);
  };

  const initials = authorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="glass-card rounded-2xl overflow-hidden"
      data-ocid={`feed.item.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link
          to="/profile/$userId"
          params={{ userId: post.authorId.toString() }}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="relative shrink-0">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold ring-2 ring-primary/30">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {authorName}
            </p>
            <p className="text-xs text-muted-foreground">
              @{authorUsername} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </Link>
        <button
          type="button"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 transition-neon shrink-0"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-sm leading-relaxed text-foreground break-words">
          {post.content}
        </p>
        {post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
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
      </div>

      {/* Media */}
      {post.imageUrls.length > 0 && (
        <div
          className={`${post.imageUrls.length > 1 ? "grid grid-cols-2 gap-0.5" : ""} overflow-hidden`}
        >
          {post.imageUrls.slice(0, 4).map((url, i) => (
            <div
              key={url}
              className="relative aspect-video bg-muted overflow-hidden"
            >
              <img
                src={url}
                alt={`Post ${i + 1}`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {post.imageUrls.length > 4 && i === 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-xl font-bold text-white">
                    +{post.imageUrls.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {post.isReel && post.videoUrl && (
        <div className="relative mx-4 mb-2 aspect-[9/16] max-h-72 overflow-hidden rounded-xl bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary neon-glow-purple">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
          <div className="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
            REEL
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1">
          {/* Like with emoji reaction */}
          <div className="relative">
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={handleLike}
              onMouseEnter={() => setShowEmoji(true)}
              onMouseLeave={() => setShowEmoji(false)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-neon ${
                liked
                  ? "text-rose-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`feed.like_button.${index + 1}`}
              aria-label="Like post"
            >
              <motion.div
                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={18}
                  fill={liked ? "currentColor" : "none"}
                  className={
                    liked ? "drop-shadow-[0_0_6px_rgba(251,113,133,0.8)]" : ""
                  }
                />
              </motion.div>
              <span>{formatCount(BigInt(localLikes))}</span>
            </motion.button>

            <AnimatePresence>
              {showEmoji && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.9 }}
                  className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-2xl glass-card p-2 shadow-xl z-10"
                >
                  {EMOJIS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={handleLike}
                      className="text-xl hover:scale-125 transition-neon"
                      aria-label={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-neon ${
              showComments
                ? "text-secondary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`feed.comment_button.${index + 1}`}
            aria-label="Comment"
          >
            <MessageCircle size={18} />
            <span>
              {formatCount(
                BigInt(Number(post.commentsCount) + localComments.length),
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-neon"
            data-ocid={`feed.share_button.${index + 1}`}
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={`rounded-xl p-2 transition-neon ${
            saved
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid={`feed.save_button.${index + 1}`}
          aria-label={saved ? "Unsave post" : "Save post"}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/30"
          >
            <div className="px-4 py-3 space-y-3">
              {localComments.map((c, ci) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: comments are ephemeral local state
                <div key={ci} className="flex items-start gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    U
                  </div>
                  <p className="text-sm text-foreground bg-muted/40 rounded-xl px-3 py-1.5 break-words">
                    {c}
                  </p>
                </div>
              ))}
              {localComments.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No comments yet. Be the first!
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && commentText.trim()) {
                      setLocalComments((prev) => [...prev, commentText.trim()]);
                      setCommentText("");
                    }
                  }}
                  placeholder="Add a comment…"
                  className="flex-1 rounded-xl bg-muted/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-neon"
                  data-ocid={`feed.comment_input.${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (commentText.trim()) {
                      setLocalComments((prev) => [...prev, commentText.trim()]);
                      setCommentText("");
                    }
                  }}
                  className="shrink-0 rounded-xl bg-primary/20 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/30 transition-neon"
                  data-ocid={`feed.comment_submit.${index + 1}`}
                >
                  Post
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
