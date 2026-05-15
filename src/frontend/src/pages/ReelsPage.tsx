import SkeletonCard from "@/components/ui/SkeletonCard";
import { useReels } from "@/hooks/useQueries";
import { Play, Volume2 } from "lucide-react";
import { motion } from "motion/react";

export default function ReelsPage() {
  const { data: reels, isLoading } = useReels();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center gap-2"
      >
        <Play size={22} className="text-accent fill-accent" />
        <h1 className="text-2xl font-bold text-foreground">Reels</h1>
      </motion.div>

      <div className="space-y-4" data-ocid="reels.list">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {!isLoading && !(reels?.pages?.flat()?.length ?? 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="reels.empty_state"
          >
            <p className="text-4xl mb-3">🎬</p>
            <h3 className="font-semibold text-foreground mb-2">No reels yet</h3>
            <p className="text-sm text-muted-foreground">
              Short video reels will appear here when creators upload them.
            </p>
          </div>
        )}

        {reels?.pages?.flat()?.map((reel, i) => (
          <motion.div
            key={reel.id.toString()}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden"
            data-ocid={`reels.item.${i + 1}`}
          >
            {reel.videoUrl ? (
              <video
                src={reel.videoUrl}
                className="w-full aspect-[9/16] object-cover"
                controls
                playsInline
              >
                <track kind="captions" src="" label="Captions" />
              </video>
            ) : (
              <div className="w-full aspect-[9/16] bg-muted/30 flex items-center justify-center">
                <Volume2 size={40} className="text-muted-foreground/40" />
              </div>
            )}
            <div className="p-4">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                {reel.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
