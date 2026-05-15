import { createActor } from "@/backend";
import GlassCard from "@/components/ui/GlassCard";
import { isOk } from "@/lib/backend";
import type { ChatMessage } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { Bot, Key, Send, Sparkles, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AIPage() {
  const { actor } = useActor(createActor);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  async function saveApiKey() {
    if (!actor || !apiKey.trim()) return;
    setSavingKey(true);
    try {
      const result = await actor.setMyOpenAIApiKey(apiKey.trim());
      if (isOk(result)) {
        toast.success("API key saved!");
        setApiKey("");
        setShowKeyInput(false);
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to save API key");
    } finally {
      setSavingKey(false);
    }
  }

  async function clearApiKey() {
    if (!actor) return;
    try {
      const result = await actor.clearMyOpenAIApiKey();
      if (isOk(result)) {
        toast.success("API key cleared");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to clear API key");
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !input.trim() || sending) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const result = await actor.chatWithAI(userMsg.content, history);
      if (isOk(result)) {
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: result.ok,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        toast.error(result.err);
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch {
      toast.error("AI request failed");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="px-4 py-6 max-w-2xl mx-auto flex flex-col"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Bot size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeyInput((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-neon"
            data-ocid="ai.api_key_button"
          >
            <Key size={14} /> API Key
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-neon"
              data-ocid="ai.clear_chat_button"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* API key panel */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <GlassCard className="p-4">
              <p className="text-xs text-muted-foreground mb-3">
                Enter your OpenAI API key to enable the AI chat. It's stored
                securely on-chain.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 rounded-xl border border-border/40 bg-muted/30 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-neon"
                  data-ocid="ai.api_key_input"
                />
                <button
                  type="button"
                  onClick={saveApiKey}
                  disabled={savingKey || !apiKey.trim()}
                  className="gradient-primary rounded-xl px-4 py-2 text-sm font-medium transition-neon disabled:opacity-60"
                  data-ocid="ai.save_key_button"
                >
                  {savingKey ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={clearApiKey}
                  className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive hover:bg-destructive/20 transition-neon"
                  data-ocid="ai.clear_key_button"
                >
                  Clear
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat messages */}
      <div
        className="flex-1 space-y-4 mb-4 overflow-y-auto"
        data-ocid="ai.chat_list"
      >
        {messages.length === 0 && (
          <div
            className="glass-card rounded-2xl p-10 text-center"
            data-ocid="ai.empty_state"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles size={32} />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI Assistant</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Generate captions, get content ideas, or just chat. Set your
              OpenAI API key above to get started.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={`${msg.role}-${i}-${msg.content.slice(0, 8)}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
            data-ocid={`ai.message.${i + 1}`}
          >
            {msg.role === "assistant" && (
              <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Bot size={16} />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary/20 text-foreground rounded-tr-sm"
                  : "glass-card rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Bot size={16} />
            </div>
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex gap-1 items-center h-5">
                {["b0", "b1", "b2"].map((j, jIdx) => (
                  <motion.div
                    key={j}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.8,
                      delay: jIdx * 0.15,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-primary/60"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI anything..."
          disabled={sending}
          className="flex-1 rounded-2xl border border-border/40 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-neon disabled:opacity-60"
          data-ocid="ai.message_input"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="gradient-primary flex h-12 w-12 items-center justify-center rounded-2xl transition-neon disabled:opacity-50"
          data-ocid="ai.send_button"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
