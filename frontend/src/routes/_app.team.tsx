import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star, TrendingUp, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { astrologers, inr } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/team")({
  head: () => ({ meta: [{ title: "Team — Humara Pandit CRM" }] }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Team & Astrologers"
        subtitle="Admin-only view of every astrologer's performance and revenue."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {astrologers.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-hover rounded-2xl glass p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground"
                style={{ background: `oklch(0.72 0.13 ${a.avatarHue})` }}
              >
                {a.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.specialty}</p>
              </div>
              <Badge variant="outline" className="ml-auto gap-1 border-gold/40 text-gold">
                <Star className="h-3 w-3" fill="currentColor" /> {a.rating}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-secondary/50 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> Consultations
                </div>
                <p className="mt-1 text-lg font-bold">{a.consultations}</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" /> Revenue
                </div>
                <p className="mt-1 text-lg font-bold">{inr(a.revenue)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
