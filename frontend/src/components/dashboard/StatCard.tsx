import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  index = 0,
  accent = "primary",
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  index?: number;
  accent?: "primary" | "gold" | "success" | "warning";
}) {
  const accentBg =
    accent === "gold"
      ? "bg-gold/15 text-gold"
      : accent === "success"
        ? "bg-success/15 text-success"
        : accent === "warning"
          ? "bg-warning/15 text-warning"
          : "bg-primary/15 text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="card-hover relative overflow-hidden rounded-2xl glass p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accentBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              delta >= 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
            )}
          >
            {delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}
