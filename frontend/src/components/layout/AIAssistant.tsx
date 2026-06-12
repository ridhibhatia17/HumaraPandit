import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { Bot, Sparkles, X, Send, NotebookPen, Gem, MessageSquareReply } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const suggestions = [
  { icon: NotebookPen, label: "Generate consultation notes for a career-clarity client" },
  { icon: Gem, label: "Suggest remedies for a weak Jupiter" },
  { icon: MessageSquareReply, label: "Draft a follow-up message for a customer" },
];

function partsToText(parts: { type: string; text?: string }[]) {
  return parts.map((p) => (p.type === "text" ? (p.text ?? "") : "")).join("");
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: `${import.meta.env.VITE_API_BASE_URL || ""}/api/chat` }),
    onError: (err) => {
      const msg = err.message?.includes("402")
        ? "AI credits exhausted — please add credits to continue."
        : err.message?.includes("429")
          ? "Too many requests — please wait a moment and try again."
          : "Something went wrong reaching the assistant.";
      toast.error(msg);
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const submit = (text: string) => {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
    setInput("");
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] shadow-glow"
      >
        {open ? <X className="h-6 w-6 text-primary-foreground" /> : <Bot className="h-6 w-6 text-primary-foreground" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl glass-strong shadow-glow"
          >
            <div className="flex items-center gap-3 border-b border-border/60 bg-[image:var(--gradient-primary)] p-4">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
              <div>
                <p className="font-display text-sm font-bold text-primary-foreground">Jyotish AI Assistant</p>
                <p className="text-[11px] text-primary-foreground/80">Powered by Lovable AI</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-secondary/70 px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                  🔮 Namaste! I'm your AI astrology assistant. Ask me about consultation notes,
                  remedies, gemstones or follow-ups — or anything else.
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/70 text-foreground",
                    )}
                  >
                    {partsToText(m.parts)}
                  </div>
                </div>
              ))}

              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-secondary/70 px-3.5 py-2.5 text-sm text-muted-foreground">
                    Thinking…
                  </div>
                </div>
              )}

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => submit(s.label)}
                      className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      <s.icon className="h-3 w-3 shrink-0" />
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-border/60 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm outline-none focus:border-primary/60"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="shrink-0 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
