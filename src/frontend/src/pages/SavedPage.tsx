import PostCard from "@/components/ui/PostCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { useSavedPosts } from "@/hooks/useQueries";
import { Bookmark } from "lucide-react";
import { motion } from "motion/react";

export default function SavedPage() {
  const { data: posts, isLoading } = useSavedPosts();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-2"
      >
        <Bookmark size={22} className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Saved Posts</h1>
      </motion.div>

      <div className="space-y-4" data-ocid="saved.list">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {!isLoading && (!posts || posts.length === 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="saved.empty_state"
          >
            <p className="text-4xl mb-3">🔖</p>
            <h3 className="font-semibold text-foreground mb-2">
              No saved posts
            </h3>
            <p className="text-sm text-muted-foreground">
              Tap the bookmark icon on any post to save it for later.
            </p>
          </div>
        )}

        {posts?.map((post, i) => (
          <PostCard key={post.id.toString()} post={post} index={i} isSaved />
        ))}
      </div>
    </div>
  );
}
