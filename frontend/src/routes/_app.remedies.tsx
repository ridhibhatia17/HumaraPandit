import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { inr, type Remedy } from "@/lib/mock-data";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/remedies")({
  head: () => ({ meta: [{ title: "Remedies & Gemstones — Humara Pandit CRM" }] }),
  component: RemediesPage,
});

const types = ["All", "Gemstone", "Rudraksha", "Yantra", "Spiritual Remedy"];
const remedyTypes = ["Gemstone", "Rudraksha", "Yantra", "Spiritual Remedy"] as const;

const TYPE_EMOJIS: Record<string, string> = {
  Gemstone: "💎",
  Rudraksha: "📿",
  Yantra: "🔱",
  "Spiritual Remedy": "🕉️",
};

function RemediesPage() {
  const { data: remedies, loading, create } = useCollection<Remedy>("/api/remedies");
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Gemstone" as Remedy["type"],
    description: "",
    benefits: "",
    reason: "",
    price: "",
    emoji: "💎",
  });

  const list = filter === "All" ? remedies : remedies.filter((r) => r.type === filter);

  const addRemedy = async () => {
    if (!form.name.trim()) return toast.error("Remedy name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    try {
      await create({
        name: form.name.trim(),
        type: form.type,
        emoji: form.emoji || TYPE_EMOJIS[form.type] || "✨",
        price: Number(form.price) || 0,
        description: form.description.trim(),
        benefits: form.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
        reason: form.reason.trim() || "Recommended by astrologer.",
      });
      setOpen(false);
      setForm({ name: "", type: "Gemstone", description: "", benefits: "", reason: "", price: "", emoji: "💎" });
      toast.success("Remedy added ✨");
    } catch (e) {}
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading remedies...</div>;

  return (
    <div>
      <PageHeader
        title="Remedies & Gemstones"
        subtitle="Recommend gemstones, rudraksha, yantras and spiritual remedies"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[image:var(--gradient-primary)] shadow-glow"><Plus className="h-4 w-4" /> Add Remedy</Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Add a new remedy</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Yellow Sapphire (Pukhraj)" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Emoji</Label>
                    <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="💛" className="text-center text-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Remedy["type"], emoji: TYPE_EMOJIS[v] || form.emoji })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {remedyTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price (₹)</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="18500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Powerful Jupiter stone for wisdom and prosperity." rows={2} />
                </div>
                <div className="space-y-1.5">
                  <Label>Benefits (comma-separated)</Label>
                  <Input value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} placeholder="Enhances wealth, Improves focus, Strengthens Jupiter" />
                </div>
                <div className="space-y-1.5">
                  <Label>Recommendation reason</Label>
                  <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Recommended for weak Jupiter in 7th house." />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addRemedy} className="bg-[image:var(--gradient-primary)]">Add remedy</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              filter === t ? "border-primary bg-primary/15 text-foreground" : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card-hover flex flex-col overflow-hidden rounded-2xl glass"
          >
            <div className="relative flex h-32 items-center justify-center overflow-hidden bg-[image:var(--gradient-cosmic)]">
              <span className="text-6xl drop-shadow-lg">{r.emoji}</span>
              <span className="absolute right-3 top-3 rounded-full bg-background/70 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur">{r.type}</span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display font-semibold">{r.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              <div className="mt-3 space-y-1">
                {r.benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-success" /> {b}
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-2.5 text-xs">
                <span className="font-semibold text-gold">Why recommend: </span>
                <span className="text-muted-foreground">{r.reason}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gold">{inr(r.price)}</span>
                <Button size="sm" className="bg-[image:var(--gradient-primary)]" onClick={() => toast.success(`${r.name} recommended ✨`)}>Recommend</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

