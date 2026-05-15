import PostCard from "@/components/ui/PostCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { useExplorePosts, useTrendingHashtags } from "@/hooks/useQueries";
import { Compass, Hash } from "lucide-react";
import { motion } from "motion/react";

export default function ExplorePage() {
  const { data: posts, isLoading } = useExplorePosts();
  const { data: trending } = useTrendingHashtags();

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-1">
          <Compass size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Explore</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Discover trending content and new creators
        </p>
      </motion.div>

      {/* Trending hashtags strip */}
      {trending && trending.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {trending.slice(0, 10).map(([tag]) => (
            <span
              key={tag}
              className="shrink-0 flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs font-medium text-primary hover:border-primary/50 hover:bg-primary/10 cursor-pointer transition-neon"
            >
              <Hash size={11} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-4" data-ocid="explore.list">
        {isLoading &&
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {!isLoading && (!posts || posts.pages.flat().length === 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="explore.empty_state"
          >
            <p className="text-3xl mb-3">🔭</p>
            <h3 className="font-semibold text-foreground mb-2">
              Nothing to explore yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Check back soon for fresh content.
            </p>
          </div>
        )}

        {posts?.pages.flat().map((post, i) => (
          <PostCard key={post.id.toString()} post={post} index={i} />
        ))}
      </div>
    </div>
  );
}
