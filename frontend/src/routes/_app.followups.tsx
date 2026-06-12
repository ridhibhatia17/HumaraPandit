import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CalendarPlus, Clock, AlertCircle, CheckCircle2, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { astrologers, type FollowUp, type FollowUpStage } from "@/lib/mock-data";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/followups")({
  head: () => ({ meta: [{ title: "Follow-Ups — Humara Pandit CRM" }] }),
  component: FollowUpsPage,
});

const COLUMNS: { stage: FollowUpStage; tint: string; icon: typeof Clock }[] = [
  { stage: "Upcoming", tint: "text-primary", icon: Clock },
  { stage: "Scheduled", tint: "text-chart-3", icon: CalendarClock },
  { stage: "Missed", tint: "text-destructive", icon: AlertCircle },
  { stage: "Done", tint: "text-success", icon: CheckCircle2 },
];

const ORDER: FollowUpStage[] = ["Upcoming", "Scheduled", "Missed", "Done"];

function FollowUpsPage() {
  const { data: followups, loading, create, update } = useCollection<FollowUp>("/api/followups");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    note: "",
    due: "",
    astrologer: astrologers[0].name,
  });

  const move = async (id: string, dir: 1 | -1) => {
    const f = followups.find((x) => x.id === id);
    if (!f) return;
    const idx = ORDER.indexOf(f.stage);
    const next = ORDER[Math.min(ORDER.length - 1, Math.max(0, idx + dir))];
    try {
      await update(id, { stage: next });
      toast.success("Follow-up updated");
    } catch (e) {}
  };

  const addReminder = async () => {
    if (!form.customer.trim()) return toast.error("Customer name is required");
    if (!form.note.trim()) return toast.error("Reminder note is required");
    try {
      await create({
        customer: form.customer.trim(),
        customerId: `c${Date.now()}`,
        note: form.note.trim(),
        due: form.due || new Date().toISOString().split("T")[0],
        stage: "Upcoming",
        astrologer: form.astrologer,
      });
      setOpen(false);
      setForm({ customer: "", note: "", due: "", astrologer: astrologers[0].name });
      toast.success("Reminder scheduled 📅");
    } catch (e) {}
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading follow-ups...</div>;

  const count = (s: FollowUpStage) => followups.filter((f) => f.stage === s).length;

  return (
    <div>
      <PageHeader title="Follow-Up Management" subtitle="Track reminders and customer engagement on a Kanban board" />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Upcoming" value={String(count("Upcoming"))} icon={Clock} index={0} />
        <StatCard label="Scheduled" value={String(count("Scheduled"))} icon={CalendarClock} index={1} accent="gold" />
        <StatCard label="Missed" value={String(count("Missed"))} icon={AlertCircle} index={2} accent="warning" />
        <StatCard label="Completed" value={String(count("Done"))} icon={CheckCircle2} index={3} accent="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = followups.filter((f) => f.stage === col.stage);
          return (
            <div key={col.stage} className="rounded-2xl glass p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <col.icon className={`h-4 w-4 ${col.tint}`} />
                  <h3 className="text-sm font-semibold">{col.stage}</h3>
                </div>
                <span className="rounded-full bg-secondary px-2 text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((f) => (
                  <motion.div key={f.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7"><AvatarFallback className="bg-[image:var(--gradient-primary)] text-[10px] text-primary-foreground">{f.customer.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                      <p className="text-sm font-medium">{f.customer}</p>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{f.note}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-primary">Due {f.due}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(f.id, -1)}><ArrowRight className="h-3 w-3 rotate-180" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(f.id, 1)}><ArrowRight className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {items.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No items</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><CalendarPlus className="h-4 w-4" /> Schedule new reminder</Button>
          </DialogTrigger>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle>Schedule a reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Customer name</Label>
                <Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Aarav Sharma" />
              </div>
              <div className="space-y-1.5">
                <Label>Reminder note</Label>
                <Textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Check gemstone wearing results" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Due date</Label>
                  <Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Astrologer</Label>
                  <Select value={form.astrologer} onValueChange={(v) => setForm({ ...form, astrologer: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {astrologers.map((a) => (
                        <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addReminder} className="bg-[image:var(--gradient-primary)]">Schedule reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

