import { createActor } from "@/backend";
import type {
  UserProfile,
  Post,
  Comment,
  Message,
  Conversation,
  Notification,
  AdminStats,
} from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";
import { useActor } from "@caffeineai/core-infrastructure";

// Re-export createActor for use in hooks
export { createActor };

// Re-export types
export type {
  UserProfile,
  Post,
  Comment,
  Message,
  Conversation,
  Notification,
  AdminStats,
};

// useBackend hook — returns the actor from core-infrastructure
export function useBackend() {
  return useActor(createActor);
}

// Type helpers for AI result variants
export type AIResult = { __kind__: "ok"; ok: string } | { __kind__: "err"; err: string };
export type HashtagResult = { __kind__: "ok"; ok: string[] } | { __kind__: "err"; err: string };

export function isOk<T>(result: { __kind__: "ok"; ok: T } | { __kind__: "err"; err: string }): result is { __kind__: "ok"; ok: T } {
  return result.__kind__ === "ok";
}
