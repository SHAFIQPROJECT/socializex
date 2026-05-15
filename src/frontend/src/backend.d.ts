import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Comment {
    id: bigint;
    isDeleted: boolean;
    content: string;
    authorId: Principal;
    createdAt: bigint;
    likesCount: bigint;
    postId: bigint;
}
export interface AdminStats {
    bannedUsers: bigint;
    totalReports: bigint;
    activeConversations: bigint;
    totalUsers: bigint;
    totalPosts: bigint;
    totalComments: bigint;
}
export interface Post {
    id: bigint;
    isDeleted: boolean;
    content: string;
    hashtags: Array<string>;
    imageUrls: Array<string>;
    authorId: Principal;
    createdAt: bigint;
    isReel: boolean;
    commentsCount: bigint;
    likesCount: bigint;
    videoUrl: string;
    scheduledAt?: bigint;
}
export interface Notification {
    id: bigint;
    notifType: string;
    createdAt: bigint;
    isRead: boolean;
    actorId: Principal;
    entityId: string;
    recipientId: Principal;
}
export interface Message {
    id: bigint;
    content: string;
    createdAt: bigint;
    isRead: boolean;
    conversationId: bigint;
    senderId: Principal;
}
export interface Conversation {
    id: bigint;
    participants: Array<Principal>;
    lastMessageAt: bigint;
    isGroup: boolean;
    createdAt: bigint;
    lastMessage: string;
    groupName: string;
}
export interface UserProfile {
    id: Principal;
    bio: string;
    username: string;
    displayName: string;
    socialLinks: Array<string>;
    followersCount: bigint;
    createdAt: bigint;
    avatarUrl: string;
    isBanned: boolean;
    isAdmin: boolean;
    followingCount: bigint;
    coverUrl: string;
    skills: Array<string>;
    postsCount: bigint;
}
export interface backendInterface {
    addComment(postId: bigint, content: string): Promise<bigint>;
    adminDeletePost(postId: bigint): Promise<boolean>;
    banUser(target: Principal): Promise<boolean>;
    chatWithAI(_message: string, _history: Array<{
        content: string;
        role: string;
    }>): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    clearMyOpenAIApiKey(): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    createConversation(participants: Array<Principal>, isGroup: boolean, groupName: string): Promise<bigint>;
    createPost(content: string, imageUrls: Array<string>, videoUrl: string, hashtags: Array<string>, isReel: boolean, scheduledAt: bigint | null): Promise<bigint>;
    deleteComment(commentId: bigint): Promise<boolean>;
    deletePost(postId: bigint): Promise<boolean>;
    followUser(target: Principal): Promise<boolean>;
    generateCaption(_desc: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getAdminPosts(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getAdminStats(): Promise<AdminStats>;
    getAdminUsers(limit: bigint, offset: bigint): Promise<Array<UserProfile>>;
    getComments(postId: bigint): Promise<Array<Comment>>;
    getConversations(): Promise<Array<Conversation>>;
    getExplorePosts(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getFeedPosts(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getFollowers(uid: Principal): Promise<Array<UserProfile>>;
    getFollowing(uid: Principal): Promise<Array<UserProfile>>;
    getMessages(convId: bigint, limit: bigint, offset: bigint): Promise<Array<Message>>;
    getMyProfile(): Promise<UserProfile | null>;
    getNotifications(): Promise<Array<Notification>>;
    getPost(postId: bigint): Promise<Post | null>;
    getProfile(uid: Principal): Promise<UserProfile | null>;
    getReels(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getSavedPosts(): Promise<Array<Post>>;
    getSuggestedUsers(): Promise<Array<UserProfile>>;
    getTrendingHashtags(): Promise<Array<[string, bigint]>>;
    getUnreadNotificationCount(): Promise<bigint>;
    getUserPosts(uid: Principal, limit: bigint, offset: bigint): Promise<Array<Post>>;
    isFollowingUser(target: Principal): Promise<boolean>;
    isMyOpenAIConfigured(): Promise<boolean>;
    isPostLiked(postId: bigint): Promise<boolean>;
    likeComment(commentId: bigint): Promise<boolean>;
    likePost(postId: bigint): Promise<boolean>;
    markAllNotificationsRead(): Promise<void>;
    markMessageRead(msgId: bigint): Promise<boolean>;
    markNotificationRead(notifId: bigint): Promise<boolean>;
    registerUser(username: string, displayName: string): Promise<boolean>;
    reportContent(contentType: string, contentId: string, reason: string): Promise<bigint>;
    savePost(postId: bigint): Promise<boolean>;
    searchUsers(query: string): Promise<Array<UserProfile>>;
    sendMessage(convId: bigint, content: string): Promise<bigint>;
    setMyOpenAIApiKey(_key: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    suggestHashtags(_content: string): Promise<{
        __kind__: "ok";
        ok: Array<string>;
    } | {
        __kind__: "err";
        err: string;
    }>;
    unbanUser(target: Principal): Promise<boolean>;
    unfollowUser(target: Principal): Promise<boolean>;
    unlikePost(postId: bigint): Promise<boolean>;
    unsavePost(postId: bigint): Promise<boolean>;
    updateProfile(displayName: string, bio: string, avatarUrl: string, coverUrl: string, socialLinks: Array<string>, skills: Array<string>): Promise<boolean>;
}
