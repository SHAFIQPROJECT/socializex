import type { Principal } from "@icp-sdk/core/principal";

export type {
  Comment,
  AdminStats,
  Post,
  Notification,
  Message,
  Conversation,
  UserProfile,
} from "@/backend";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface PostAuthorInfo {
  displayName: string;
  username: string;
  avatarUrl: string;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};

export type PostCreateInput = {
  content: string;
  imageUrls: string[];
  videoUrl: string;
  hashtags: string[];
  isReel: boolean;
  scheduledAt: bigint | null;
};
