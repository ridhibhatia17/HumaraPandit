import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { TrendingUp, Users, Target, Star } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  revenueData, customerGrowth, funnelStages, topGemstones, astrologers, inr,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Humara Pandit CRM" }] }),
  component: AnalyticsPage,
});

function Card({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl glass p-5 ${className ?? ""}`}>
      <div className="mb-4"><h3 className="font-display font-semibold">{title}</h3>{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}</div>
      {children}
    </motion.div>
  );
}

const tip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" } as const;

function AnalyticsPage() {
  const maxFunnel = funnelStages[0].count;
  const maxGem = topGemstones[0].count;

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Performance insights across your astrology practice" />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={inr(2679000)} delta={22} icon={TrendingUp} index={0} accent="gold" />
        <StatCard label="Customer Growth" value="+182%" delta={31} icon={Users} index={1} />
        <StatCard label="Conversion Rate" value="23.1%" delta={4} icon={Target} index={2} accent="success" />
        <StatCard label="Avg. Rating" value="4.8 / 5" delta={2} icon={Star} index={3} accent="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Revenue Trend" subtitle="Monthly revenue growth">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs><linearGradient id="a-rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--gold)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--gold)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip contentStyle={tip} formatter={(v: number) => inr(v)} />
              <Area type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={2.5} fill="url(#a-rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Customer Growth" subtitle="Cumulative customers">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tip} />
              <Line type="monotone" dataKey="customers" stroke="var(--chart-1)" strokeWidth={3} dot={{ fill: "var(--chart-1)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Consultation Volume" subtitle="Sessions per month">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--secondary)" }} contentStyle={tip} />
              <Bar dataKey="consultations" radius={[6, 6, 0, 0]} fill="var(--chart-3)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Lead Funnel" subtitle="New Lead → Converted Customer">
          <div className="space-y-3">
            {funnelStages.map((s, i) => (
              <div key={s.stage}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.stage}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-secondary/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.count / maxFunnel) * 100}%` }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Performing Astrologers" subtitle="By revenue">
          <div className="space-y-3">
            {astrologers.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="w-4 text-sm font-bold text-gold">{i + 1}</span>
                <span className="flex-1 truncate text-sm">{a.name}</span>
                <div className="h-2 w-28 overflow-hidden rounded-full bg-secondary/50">
                  <div className="h-full rounded-full bg-[image:var(--gradient-primary)]" style={{ width: `${(a.revenue / astrologers[0].revenue) * 100}%` }} />
                </div>
                <span className="w-20 text-right text-sm font-semibold">{inr(a.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Most Recommended Gemstones" subtitle="By recommendation count">
          <div className="space-y-3">
            {topGemstones.map((g, i) => (
              <div key={g.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{g.name}</span>
                  <span className="font-semibold">{g.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(g.count / maxGem) * 100}%` }} transition={{ delay: i * 0.06 }} className="h-full rounded-full bg-gradient-to-r from-gold to-primary" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
