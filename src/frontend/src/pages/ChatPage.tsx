import SkeletonCard from "@/components/ui/SkeletonCard";
import UserAvatar from "@/components/ui/UserAvatar";
import { useConversations } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Plus } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function ChatPage() {
  const { data: conversations, isLoading } = useConversations();

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <MessageCircle size={22} className="text-secondary" />
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        </motion.div>
        <button
          type="button"
          onClick={() =>
            toast.info(
              "Use the Explore page to find users and start a conversation.",
            )
          }
          className="flex items-center gap-1.5 rounded-xl bg-primary/15 px-3 py-2 text-sm text-primary hover:bg-primary/25 transition-neon"
          data-ocid="chat.new_conversation_button"
        >
          <Plus size={16} />
          New
        </button>
      </div>

      <div className="space-y-2" data-ocid="chat.list">
        {isLoading &&
          ["c0", "c1", "c2", "c3"].map((k) => <SkeletonCard key={k} />)}

        {!isLoading && (!conversations || conversations.length === 0) && (
          <div
            className="glass-card rounded-2xl p-12 text-center"
            data-ocid="chat.empty_state"
          >
            <p className="text-4xl mb-3">💬</p>
            <h3 className="font-semibold text-foreground mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Start chatting with other users.
            </p>
          </div>
        )}

        {conversations?.map((conv, i) => (
          <Link
            key={conv.id.toString()}
            to="/chat/$conversationId"
            params={{ conversationId: conv.id.toString() }}
            data-ocid={`chat.item.${i + 1}`}
          >
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ x: 4 }}
              className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-border/60 transition-neon cursor-pointer"
            >
              <UserAvatar
                name={
                  conv.isGroup
                    ? conv.groupName
                    : conv.participants[0]?.toString()
                }
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-foreground truncate">
                  {conv.isGroup ? conv.groupName : "Direct Message"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.lastMessage || "No messages yet"}
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {formatDistanceToNow(
                  new Date(Number(conv.lastMessageAt) / 1_000_000),
                  { addSuffix: true },
                )}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
