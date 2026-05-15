import UserCard from "@/components/UserCard";
import PostCard from "@/components/ui/PostCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import {
  useCreatePost,
  useFeedPosts,
  useSuggestedUsers,
  useTrendingHashtags,
} from "@/hooks/useQueries";
import { Flame, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedPage() {
  const { data: posts, isLoading } = useFeedPosts();
  const { data: suggested } = useSuggestedUsers();
  const { data: trending } = useTrendingHashtags();
  const createPost = useCreatePost();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleCreatePost = () => {
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("Post content cannot be empty.");
      return;
    }
    const tags = hashtags
      .split(/[\s,#]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    createPost.mutate(
      {
        content: trimmed,
        hashtags: tags,
        imageUrls: [],
        isReel: false,
        videoUrl: "",
        scheduledAt: null,
      },
      {
        onSuccess: () => {
          setContent("");
          setHashtags("");
          toast.success("Post published!");
        },
        onError: () => toast.error("Failed to publish post."),
      },
    );
  };

  return (
    <div className="flex gap-6 px-4 py-6 max-w-6xl mx-auto">
      {/* Main Feed */}
      <main className="flex-1 min-w-0 space-y-4" data-ocid="feed.list">
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          Your Feed
        </motion.h1>

        {/* Create Post */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-2xl p-4 space-y-3"
          data-ocid="feed.create_post_card"
        >
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none rounded-xl bg-muted/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-neon"
            data-ocid="feed.create_post_textarea"
          />
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#hashtags (space or comma separated)"
              className="flex-1 rounded-xl bg-muted/40 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-neon"
              data-ocid="feed.create_post_hashtags"
            />
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePost}
              disabled={createPost.isPending}
              className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-neon disabled:opacity-50"
              data-ocid="feed.create_post_submit_button"
            >
              {createPost.isPending ? "Posting…" : "Post"}
            </motion.button>
          </div>
        </motion.div>

        {isLoading &&
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && (!posts || posts.pages.flat().length === 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="feed.empty_state"
          >
            <p className="text-3xl mb-3">🌟</p>
            <h3 className="font-semibold text-foreground mb-2">
              Your feed is empty
            </h3>
            <p className="text-sm text-muted-foreground">
              Follow some people on the Explore page to see their posts here.
            </p>
          </div>
        )}

        {posts?.pages.flat().map((post, i) => (
          <PostCard key={post.id.toString()} post={post} index={i} />
        ))}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:flex flex-col gap-4 w-72 shrink-0">
        {/* Trending */}
        {trending && trending.length > 0 && (
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={16} className="text-accent" />
              <h3 className="font-semibold text-sm text-foreground">
                Trending
              </h3>
            </div>
            <div className="space-y-2">
              {trending.slice(0, 8).map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm text-primary hover:text-primary/80 cursor-pointer transition-neon">
                    #{tag}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {count.toString()} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Users */}
        {suggested && suggested.length > 0 && (
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-secondary" />
              <h3 className="font-semibold text-sm text-foreground">
                Suggested
              </h3>
            </div>
            <div className="space-y-2">
              {suggested.slice(0, 5).map((user, i) => (
                <UserCard
                  key={user.id.toString()}
                  user={user}
                  index={i}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
