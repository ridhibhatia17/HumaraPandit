import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Plus, CalendarDays, LayoutGrid, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  customers, astrologers, inr, type Consultation, type ConsultationStatus,
} from "@/lib/mock-data";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/consultations")({
  head: () => ({ meta: [{ title: "Consultations — Humara Pandit CRM" }] }),
  component: ConsultationsPage,
});

const STAGES: ConsultationStatus[] = ["Lead", "Scheduled", "Completed", "Follow-Up"];
const stageDot: Record<ConsultationStatus, string> = {
  Lead: "bg-chart-3",
  Scheduled: "bg-primary",
  Completed: "bg-success",
  "Follow-Up": "bg-gold",
};

function ConsultationsPage() {
  const { data, loading, create } = useCollection<Consultation>("/api/consultations");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer: customers[0].name, astrologer: astrologers[0].name, topic: "" });

  const addConsultation = async () => {
    if (!form.topic) return toast.error("Add a consultation topic");
    try {
      await create({
        customerId: "c1",
        customer: form.customer,
        astrologer: form.astrologer,
        topic: form.topic,
        status: "Lead",
        date: "2026-06-20",
        time: "11:00 AM",
        amount: 2100,
      });
      setOpen(false);
      setForm({ ...form, topic: "" });
      toast.success("Consultation created as Lead 🔮");
    } catch (e) {}
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading consultations...</div>;

  const days = Array.from({ length: 30 }).map((_, i) => i + 1);

  return (
    <div>
      <PageHeader
        title="Consultations"
        subtitle="Lead → Scheduled → Completed → Follow-Up workflow"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[image:var(--gradient-primary)] shadow-glow"><Plus className="h-4 w-4" /> New Consultation</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader><DialogTitle>Create consultation</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Customer</Label>
                  <Select value={form.customer} onValueChange={(v) => setForm({ ...form, customer: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{customers.slice(0, 12).map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Astrologer</Label>
                  <Select value={form.astrologer} onValueChange={(v) => setForm({ ...form, astrologer: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{astrologers.map((a) => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Topic</Label>
                  <Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Career guidance" />
                </div>
              </div>
              <DialogFooter><Button onClick={addConsultation} className="bg-[image:var(--gradient-primary)]">Create</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs defaultValue="pipeline">
        <TabsList className="bg-secondary/40">
          <TabsTrigger value="pipeline"><LayoutGrid className="mr-1.5 h-4 w-4" /> Pipeline</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="mr-1.5 h-4 w-4" /> Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((stage) => {
              const items = data.filter((c) => c.status === stage);
              return (
                <div key={stage} className="rounded-2xl glass p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${stageDot[stage]}`} />
                      <h3 className="text-sm font-semibold">{stage}</h3>
                    </div>
                    <span className="rounded-full bg-secondary px-2 text-xs text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((c) => (
                      <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-hover rounded-xl border border-border/50 bg-secondary/30 p-3">
                        <p className="text-sm font-medium">{c.topic}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Avatar className="h-6 w-6"><AvatarFallback className="bg-[image:var(--gradient-primary)] text-[10px] text-primary-foreground">{c.customer.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                          <span className="truncate text-xs text-muted-foreground">{c.customer}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" />{c.date}</span>
                          <span className="font-semibold text-gold">{inr(c.amount)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <div className="rounded-2xl glass p-5">
            <h3 className="mb-4 font-display font-semibold">June 2026</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="pb-1 font-medium">{d}</div>)}
              {days.map((d) => {
                const dayConsults = data.filter((c) => Number(c.date.slice(-2)) === d);
                return (
                  <div key={d} className="min-h-20 rounded-lg border border-border/40 bg-secondary/20 p-1.5 text-left">
                    <span className="text-xs font-medium text-foreground">{d}</span>
                    <div className="mt-1 space-y-1">
                      {dayConsults.slice(0, 2).map((c) => (
                        <div key={c.id} className={`truncate rounded px-1 py-0.5 text-[10px] text-white ${stageDot[c.status]}`}>{c.topic}</div>
                      ))}
                      {dayConsults.length > 2 && <p className="text-[10px] text-muted-foreground">+{dayConsults.length - 2}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
