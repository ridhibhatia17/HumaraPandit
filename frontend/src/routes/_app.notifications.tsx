import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Bell, CalendarClock, AlertCircle, UserPlus, Clock, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Notification } from "@/lib/mock-data";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Humara Pandit CRM" }] }),
  component: NotificationsPage,
});

const icons = {
  consultation: { icon: CalendarClock, tint: "bg-primary/15 text-primary" },
  followup: { icon: AlertCircle, tint: "bg-destructive/15 text-destructive" },
  customer: { icon: UserPlus, tint: "bg-success/15 text-success" },
  reminder: { icon: Clock, tint: "bg-gold/15 text-gold" },
} as const;

const filters = ["All", "Unread", "consultation", "followup", "customer", "reminder"] as const;

function NotificationsPage() {
  const { data: notifications, loading, update, setData } = useCollection<Notification>("/api/notifications");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const list = notifications.filter((n) =>
    filter === "All" ? true : filter === "Unread" ? !n.read : n.type === filter,
  );

  const markAll = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setData((d) => d.map((n) => ({ ...n, read: true })));
      toast.success("All marked as read");
    } catch (e) {}
  };

  const markOne = async (id: string) => {
    try {
      await update(id, { read: true });
    } catch (e) {}
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${notifications.filter((n) => !n.read).length} unread alerts`}
        action={<Button variant="outline" onClick={markAll}><CheckCheck className="h-4 w-4" /> Mark all read</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors",
              filter === f ? "border-primary bg-primary/15 text-foreground" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
            )}
          >
            {f === "followup" ? "Follow-up" : f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((n, i) => {
          const meta = icons[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
                n.read ? "border-border/50 glass" : "border-primary/30 bg-primary/5",
              )}
            >
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", meta.tint)}>
                <meta.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{n.title}</p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
              </div>
              {!n.read && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markOne(n.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          );
        })}
        {list.length === 0 && (
          <div className="rounded-2xl glass py-16 text-center text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-50" />
            No notifications here.
          </div>
        )}
      </div>
    </div>
  );
}
