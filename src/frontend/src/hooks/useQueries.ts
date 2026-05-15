import {
  type AdminStats,
  type Conversation,
  type Message,
  type Notification,
  createActor,
} from "@/backend";
import type { Post, UserProfile } from "@/backend";
import { isOk } from "@/lib/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const PAGE_SIZE = 10n;

// ── Feed ──────────────────────────────────────────────────────────────────────
export function useFeedPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useInfiniteQuery<Post[], Error, { pages: Post[][] }, [string], number>(
    {
      queryKey: ["feed"],
      queryFn: async ({ pageParam = 0 }) => {
        if (!actor) return [];
        return actor.getFeedPosts(PAGE_SIZE, BigInt(pageParam));
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === Number(PAGE_SIZE)
          ? allPages.flat().length
          : undefined,
      enabled: !!actor && !isFetching,
      refetchInterval: 30_000,
    },
  );
}

// ── Explore ───────────────────────────────────────────────────────────────────
export function useExplorePosts() {
  const { actor, isFetching } = useActor(createActor);
  return useInfiniteQuery<Post[], Error, { pages: Post[][] }, [string], number>(
    {
      queryKey: ["explore"],
      queryFn: async ({ pageParam = 0 }) => {
        if (!actor) return [];
        return actor.getExplorePosts(PAGE_SIZE, BigInt(pageParam));
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === Number(PAGE_SIZE)
          ? allPages.flat().length
          : undefined,
      enabled: !!actor && !isFetching,
    },
  );
}

export function useTrendingHashtags() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Array<[string, bigint]>>({
    queryKey: ["trending-hashtags"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingHashtags();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useSuggestedUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile[]>({
    queryKey: ["suggested-users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuggestedUsers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 120_000,
  });
}

export function useSearchUsers(query: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<UserProfile[]>({
    queryKey: ["search-users", query],
    queryFn: async () => {
      if (!actor || !query.trim()) return [];
      return actor.searchUsers(query);
    },
    enabled: !!actor && !isFetching && query.trim().length > 0,
    staleTime: 30_000,
  });
}

// ── Post mutations ────────────────────────────────────────────────────────────
export function useCreatePost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      content: string;
      imageUrls: string[];
      videoUrl: string;
      hashtags: string[];
      isReel: boolean;
      scheduledAt: bigint | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPost(
        input.content,
        input.imageUrls,
        input.videoUrl,
        input.hashtags,
        input.isReel,
        input.scheduledAt,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["explore"] });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      liked,
    }: { postId: bigint; liked: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return liked ? actor.unlikePost(postId) : actor.likePost(postId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["explore"] });
    },
  });
}

export function useSavePost() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      saved,
    }: { postId: bigint; saved: boolean }) => {
      if (!actor) throw new Error("Not connected");
      return saved ? actor.unsavePost(postId) : actor.savePost(postId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useFollowUser() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      uid,
      isFollowing,
    }: { uid: string; isFollowing: boolean }) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(uid);
      return isFollowing
        ? actor.unfollowUser(principal)
        : actor.followUser(principal);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["suggested-users"] });
      qc.invalidateQueries({ queryKey: ["feed"] });
    },
  });
}

export function useSuggestHashtags() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.suggestHashtags(content);
      if (isOk(result)) return result.ok;
      return [];
    },
  });
}
// ── Reels ─────────────────────────────────────────────────────────────────────
export function useReels() {
  const { actor, isFetching } = useActor(createActor);
  return useInfiniteQuery<Post[], Error, { pages: Post[][] }, [string], number>(
    {
      queryKey: ["reels"],
      queryFn: async ({ pageParam = 0 }) => {
        if (!actor) return [];
        return actor.getReels(PAGE_SIZE, BigInt(pageParam));
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === Number(PAGE_SIZE)
          ? allPages.flat().length
          : undefined,
      enabled: !!actor && !isFetching,
    },
  );
}

// ── Saved Posts ───────────────────────────────────────────────────────────────
export function useSavedPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Post[]>({
    queryKey: ["saved-posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSavedPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────
export function useNotifications() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

// ── Conversations ─────────────────────────────────────────────────────────────
export function useConversations() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversations();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10_000,
  });
}

// ── Messages ──────────────────────────────────────────────────────────────────
export function useMessages(convId: bigint) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Message[]>({
    queryKey: ["messages", convId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(convId, BigInt(50), BigInt(0));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5_000,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export function useAdminStats() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAdminUsers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<import("@/backend").UserProfile[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminUsers(BigInt(50), BigInt(0));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminPosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Post[]>({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminPosts(BigInt(50), BigInt(0));
    },
    enabled: !!actor && !isFetching,
  });
}
