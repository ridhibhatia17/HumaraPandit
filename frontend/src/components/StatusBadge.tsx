import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Active: "bg-success/15 text-success border-success/30",
  Lead: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  Inactive: "bg-muted text-muted-foreground border-border",
  Completed: "bg-success/15 text-success border-success/30",
  Scheduled: "bg-primary/15 text-primary border-primary/30",
  "Follow-Up": "bg-gold/15 text-gold border-gold/30",
  Upcoming: "bg-primary/15 text-primary border-primary/30",
  Missed: "bg-destructive/15 text-destructive border-destructive/30",
  Done: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        map[status] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {status}
    </span>
  );
}
