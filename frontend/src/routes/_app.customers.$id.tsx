import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Cake,
  Clock,
  Star,
  Gem,
  ListChecks,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { type Customer, type Consultation, type Remedy, type FollowUp, inr } from "@/lib/mock-data";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/customers/$id")({
  head: () => ({ meta: [{ title: "Customer Profile — Humara Pandit CRM" }] }),
  component: CustomerProfile,
});

const notesTimeline = [
  { date: "2026-06-08", text: "First contact via referral. Interested in career guidance.", author: "System" },
  { date: "2026-06-09", text: "Completed Kundli reading. Jupiter weak in 7th house.", author: "Pandit Raghav" },
  { date: "2026-06-10", text: "Recommended Yellow Sapphire & Thursday fasting.", author: "Acharya Meera" },
  { date: "2026-06-11", text: "Follow-up scheduled to review remedy results.", author: "Pandit Raghav" },
];

function CustomerProfile() {
  const { id } = useParams({ from: "/_app/customers/$id" });
  const { data: customersList, loading: lc } = useCollection<Customer>("/api/customers");
  const { data: consultations, loading: lco } = useCollection<Consultation>("/api/consultations");
  const { data: remedies, loading: lr } = useCollection<Remedy>("/api/remedies");
  const { data: followUps, loading: lf } = useCollection<FollowUp>("/api/followups");

  if (lc || lco || lr || lf) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;

  const customer = customersList.find((c) => c.id === id) ?? customersList[0];
  if (!customer) return <div className="p-8 text-center text-muted-foreground">Customer not found</div>;

  const history = consultations.filter((c) => c.customerId === id);
  const recos = remedies.slice(0, 4);
  const fups = followUps.filter((f) => f.customerId === id);

  const spiritual = [
    { label: "Zodiac Sign", value: customer.zodiac },
    { label: "Nakshatra", value: customer.nakshatra },
    { label: "Birth Date", value: customer.birthDate },
    { label: "Birth Time", value: customer.birthTime },
    { label: "Birth Place", value: customer.birthPlace },
  ];

  return (
    <div>
      <Link to="/customers">
        <Button variant="ghost" size="sm" className="mb-3 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl glass p-6"
      >
        <div className="absolute inset-0 bg-[image:var(--gradient-cosmic)] opacity-60" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 ring-4 ring-primary/20">
            <AvatarFallback style={{ background: `oklch(0.5 0.18 ${customer.avatarHue})` }} className="text-2xl font-bold text-white">
              {customer.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <StatusBadge status={customer.status} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{customer.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{customer.birthPlace}</span>
            </div>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/10 px-5 py-3 text-center">
            <p className="text-xs text-muted-foreground">Consultation Score</p>
            <p className="text-3xl font-bold text-gold">{customer.score}</p>
            <Progress value={customer.score} className="mt-1 h-1.5 w-24" />
          </div>
        </div>
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Spiritual profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-display font-semibold">Spiritual Profile</h3>
          </div>
          <dl className="space-y-3">
            {spiritual.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b border-border/40 pb-2 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-secondary/40 p-3"><Cake className="mb-1 h-4 w-4 text-gold" /><p className="text-muted-foreground">Age</p><p className="font-semibold">{2026 - Number(customer.birthDate.slice(0, 4))} yrs</p></div>
            <div className="rounded-xl bg-secondary/40 p-3"><Clock className="mb-1 h-4 w-4 text-primary" /><p className="text-muted-foreground">Consults</p><p className="font-semibold">{history.length}</p></div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass p-5 lg:col-span-2">
          <Tabs defaultValue="history">
            <TabsList className="bg-secondary/40">
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="remedies">Remedies</TabsTrigger>
              <TabsTrigger value="followups">Follow-Ups</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4 space-y-2">
              {history.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No consultations yet.</p>}
              {history.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary"><Star className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.topic}</p>
                    <p className="text-xs text-muted-foreground">{c.astrologer} · {c.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-gold">{inr(c.amount)}</span>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="remedies" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recos.map((r) => (
                <div key={r.id} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.type}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{r.reason}</p>
                  <p className="mt-1 text-sm font-semibold text-gold">{inr(r.price)}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="followups" className="mt-4 space-y-2">
              {fups.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No follow-ups scheduled.</p>}
              {fups.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3">
                  <ListChecks className="h-4 w-4 text-primary" />
                  <div className="flex-1"><p className="text-sm font-medium">{f.note}</p><p className="text-xs text-muted-foreground">Due {f.due}</p></div>
                  <StatusBadge status={f.stage} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="relative space-y-4 pl-4">
                <span className="absolute left-[5px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
                {notesTimeline.map((n, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/15" />
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{n.date} · {n.author}</p>
                    </div>
                    <p className="mt-0.5 text-sm">{n.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="bg-[image:var(--gradient-primary)]"><Gem className="h-4 w-4" /> Recommend Remedy</Button>
        <Button variant="outline"><ListChecks className="h-4 w-4" /> Schedule Follow-Up</Button>
      </div>
    </div>
  );
}
