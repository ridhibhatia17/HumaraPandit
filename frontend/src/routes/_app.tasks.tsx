import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ListTodo, Loader2, CheckCircle2, Plus, CalendarClock } from "lucide-react";
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
import { panditTasks as seed, type PanditTask, type TaskStatus, type TaskPriority } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "My Tasks — Humara Pandit CRM" }] }),
  component: TasksPage,
});

const COLUMNS: { status: TaskStatus; tint: string; icon: typeof ListTodo }[] = [
  { status: "To Do", tint: "text-primary", icon: ListTodo },
  { status: "In Progress", tint: "text-chart-3", icon: Loader2 },
  { status: "Done", tint: "text-success", icon: CheckCircle2 },
];

const ORDER: TaskStatus[] = ["To Do", "In Progress", "Done"];

const PRIORITY_STYLE: Record<TaskPriority, string> = {
  High: "bg-destructive/15 text-destructive",
  Medium: "bg-gold/15 text-gold",
  Low: "bg-secondary text-muted-foreground",
};

function TasksPage() {
  const [data, setData] = useState<PanditTask[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    detail: "",
    customer: "",
    priority: "Medium" as TaskPriority,
    due: "",
  });

  const move = (id: string, dir: 1 | -1) => {
    setData((d) =>
      d.map((t) => {
        if (t.id !== id) return t;
        const idx = ORDER.indexOf(t.status);
        const next = ORDER[Math.min(ORDER.length - 1, Math.max(0, idx + dir))];
        return { ...t, status: next };
      }),
    );
    toast.success("Task updated");
  };

  const addTask = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.customer.trim()) return toast.error("Customer name is required");
    const newTask: PanditTask = {
      id: `t${Date.now()}`,
      title: form.title.trim(),
      detail: form.detail.trim() || "No details provided.",
      customer: form.customer.trim(),
      priority: form.priority,
      status: "To Do",
      due: form.due || new Date().toISOString().split("T")[0],
    };
    setData((d) => [newTask, ...d]);
    setOpen(false);
    setForm({ title: "", detail: "", customer: "", priority: "Medium", due: "" });
    toast.success("Task created ✅");
  };

  const count = (s: TaskStatus) => data.filter((t) => t.status === s).length;

  return (
    <div>
      <PageHeader title="My Tasks" subtitle="Pandit's daily task board — track every consultation deliverable" />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="To Do" value={String(count("To Do"))} icon={ListTodo} index={0} />
        <StatCard label="In Progress" value={String(count("In Progress"))} icon={CalendarClock} index={1} accent="gold" />
        <StatCard label="Completed" value={String(count("Done"))} icon={CheckCircle2} index={2} accent="success" />
        <StatCard label="Total" value={String(data.length)} icon={ListTodo} index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = data.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="rounded-2xl glass p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <col.icon className={`h-4 w-4 ${col.tint}`} />
                  <h3 className="text-sm font-semibold">{col.status}</h3>
                </div>
                <span className="rounded-full bg-secondary px-2 text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((t) => (
                  <motion.div key={t.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{t.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="bg-[image:var(--gradient-primary)] text-[9px] text-primary-foreground">{t.customer.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground">{t.customer}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-primary">Due {t.due}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(t.id, -1)}><ArrowRight className="h-3 w-3 rotate-180" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(t.id, 1)}><ArrowRight className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {items.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No tasks</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
