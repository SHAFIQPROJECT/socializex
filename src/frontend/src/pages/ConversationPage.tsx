import { createActor } from "@/backend";
import UserAvatar from "@/components/ui/UserAvatar";
import { useMessages } from "@/hooks/useQueries";
import { useAuthStore } from "@/stores/authStore";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ConversationPage() {
  const { conversationId } = useParams({
    from: "/protected/chat/$conversationId",
  });
  const convIdBigint = BigInt(conversationId);
  const { data: messages, isLoading } = useMessages(convIdBigint);
  const { actor } = useActor(createActor);
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !text.trim()) return;
    setSending(true);
    try {
      await actor.sendMessage(convIdBigint, text.trim());
      setText("");
      qc.invalidateQueries({ queryKey: ["messages", conversationId] });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-card/60 backdrop-blur-xl">
        <Link to="/chat">
          <button
            type="button"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/50 transition-neon"
            data-ocid="conversation.back_button"
          >
            <ArrowLeft size={20} />
          </button>
        </Link>
        <UserAvatar name="Conversation" size="sm" />
        <div>
          <p className="font-semibold text-sm text-foreground">Conversation</p>
          <p className="text-xs text-muted-foreground">#{conversationId}</p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3"
        data-ocid="conversation.list"
      >
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        )}

        {messages?.map((msg, i) => {
          const isMine = user?.id.toString() === msg.senderId.toString();
          return (
            <motion.div
              key={msg.id.toString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3) }}
              className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
              data-ocid={`conversation.item.${i + 1}`}
            >
              {!isMine && (
                <UserAvatar name={msg.senderId.toString()} size="xs" />
              )}
              <div
                className={`max-w-xs lg:max-w-md ${
                  isMine
                    ? "bg-primary/20 text-foreground rounded-2xl rounded-tr-sm"
                    : "glass-card rounded-2xl rounded-tl-sm"
                } px-4 py-2.5`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {msg.content}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {formatDistanceToNow(
                    new Date(Number(msg.createdAt) / 1_000_000),
                    { addSuffix: true },
                  )}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center gap-3 px-4 py-3 border-t border-border/30 bg-card/60 backdrop-blur-xl"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-neon"
          data-ocid="conversation.message_input"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl transition-neon disabled:opacity-50"
          data-ocid="conversation.send_button"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
