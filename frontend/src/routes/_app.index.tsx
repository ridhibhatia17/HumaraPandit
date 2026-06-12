import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  CalendarClock,
  CalendarCheck,
  ListChecks,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  activityFeed,
  astrologers,
  consultationTypes,
  inr,
  revenueData,
  type FollowUp,
  type Consultation,
} from "@/lib/mock-data";
import { useAuth, type AuthUser } from "@/lib/auth";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [{ title: "Dashboard — Humara Pandit CRM" }],
  }),
  component: Dashboard,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl glass p-5 ${className ?? ""}`}
    >
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

function AdminDashboard({ user }: { user: AuthUser }) {
  const { data: followUps } = useCollection<FollowUp>("/api/followups");
  const { data: consultations } = useCollection<Consultation>("/api/consultations");
  const upcoming = followUps.filter((f) => f.stage === "Upcoming" || f.stage === "Scheduled").slice(0, 4);
  const recent = consultations.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name}`}
        subtitle="Admin Dashboard — Here's what's happening across the platform today."
        action={
          <Link to="/consultations">
            <Button className="bg-[image:var(--gradient-primary)] shadow-glow">
              <CalendarClock className="h-4 w-4" /> View All Consultations
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Customers" value="1,184" delta={18} icon={Users} index={0} />
        <StatCard label="Active Consultations" value="42" delta={9} icon={CalendarClock} index={1} accent="gold" />
        <StatCard label="Today's Appointments" value="8" delta={-3} icon={CalendarCheck} index={2} accent="success" />
        <StatCard label="Pending Follow-Ups" value="17" delta={6} icon={ListChecks} index={3} accent="warning" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue & Consultation Trends" subtitle="Last 6 months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
                formatter={(v: number) => inr(v)}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Consultation Mix" subtitle="By category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={consultationTypes} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {consultationTypes.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {consultationTypes.map((t, i) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i] }} />
                  {t.name}
                </span>
                <span className="font-medium">{t.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Recent Consultations" className="lg:col-span-2">
          <div className="space-y-2">
            {recent.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground">
                    {c.customer.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.topic} · {c.astrologer}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-gold">{inr(c.amount)}</p>
                  <p className="text-xs text-muted-foreground">{c.date}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Activity Feed">
          <div className="relative space-y-4 pl-4">
            <span className="absolute left-[5px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
            {activityFeed.map((a) => (
              <div key={a.id} className="relative">
                <span className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                <p className="text-sm leading-snug">
                  <span className="font-medium">{a.actor}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Top Astrologers" subtitle="By revenue this quarter" className="lg:col-span-2">
          <div className="space-y-2">
            {astrologers.slice(0, 4).map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15 text-sm font-bold text-gold">
                  {i + 1}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarFallback style={{ background: `oklch(0.5 0.18 ${a.avatarHue})` }} className="text-xs font-semibold text-white">
                    {a.name.split(" ").slice(-1)[0][0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.specialty}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gold">
                  <Star className="h-3 w-3" fill="currentColor" /> {a.rating}
                </div>
                <p className="hidden w-24 text-right text-sm font-semibold sm:block">{inr(a.revenue)}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Upcoming Reminders">
          <div className="space-y-2">
            {upcoming.map((f) => (
              <div key={f.id} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{f.customer}</p>
                  <StatusBadge status={f.stage} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
                <p className="mt-1 text-xs text-primary">Due {f.due}</p>
              </div>
            ))}
            <Link to="/followups">
              <Button variant="ghost" className="w-full justify-between text-sm">
                View all follow-ups <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard title="Revenue vs Consultations" subtitle="Monthly comparison">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--secondary)" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="consultations" radius={[6, 6, 0, 0]} fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-2 text-sm text-success">
            <TrendingUp className="h-4 w-4" /> Consultations up 96% over 6 months
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function PanditDashboard({ user }: { user: AuthUser }) {
  const { data: followUps } = useCollection<FollowUp>("/api/followups");
  const { data: consultations } = useCollection<Consultation>("/api/consultations");
  const upcoming = followUps.filter((f) => f.stage === "Upcoming" || f.stage === "Scheduled").slice(0, 4);
  const recent = consultations.slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name}`}
        subtitle="Pandit Dashboard — Here are your tasks and consultations for today."
        action={
          <Link to="/consultations">
            <Button className="bg-[image:var(--gradient-primary)] shadow-glow">
              <CalendarClock className="h-4 w-4" /> Start Consultation
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Assigned Customers" value="124" delta={4} icon={Users} index={0} />
        <StatCard label="Today's Appointments" value="8" delta={-3} icon={CalendarCheck} index={1} accent="success" />
        <StatCard label="Pending Follow-Ups" value="17" delta={6} icon={ListChecks} index={2} accent="warning" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="My Consultations" className="lg:col-span-2">
          <div className="space-y-2">
            {recent.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground">
                    {c.customer.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.customer}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.topic}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-muted-foreground">{c.date}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Upcoming Reminders">
          <div className="space-y-2">
            {upcoming.map((f) => (
              <div key={f.id} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{f.customer}</p>
                  <StatusBadge status={f.stage} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>
                <p className="mt-1 text-xs text-primary">Due {f.due}</p>
              </div>
            ))}
            <Link to="/followups">
              <Button variant="ghost" className="w-full justify-between text-sm">
                View all follow-ups <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Consultation Mix" subtitle="By category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={consultationTypes} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3}>
                {consultationTypes.map((_, i) => (
                  <Cell key={i} fill={pieColors[i % pieColors.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {consultationTypes.map((t, i) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i] }} />
                  {t.name}
                </span>
                <span className="font-medium">{t.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
        
        <ChartCard title="Activity Feed">
          <div className="relative space-y-4 pl-4">
            <span className="absolute left-[5px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
            {activityFeed.map((a) => (
              <div key={a.id} className="relative">
                <span className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                <p className="text-sm leading-snug">
                  <span className="font-medium">{a.actor}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  return user.role === "Admin" ? <AdminDashboard user={user} /> : <PanditDashboard user={user} />;
}
