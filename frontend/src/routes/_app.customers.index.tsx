import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Plus, Search, Trash2, Pencil, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customers as seed, type Customer, type CustomerStatus } from "@/lib/mock-data";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/_app/customers/")({
  head: () => ({ meta: [{ title: "Customers — Humara Pandit CRM" }] }),
  component: CustomersPage,
});

const PAGE_SIZE = 8;

function CustomersPage() {
  const { data, loading, create, update, remove: deleteCustomer } = useCollection<Customer>("/api/customers");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", zodiac: "Aries" });

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "", zodiac: "Aries", status: "Active" as CustomerStatus });

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const matchQ =
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.email.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query);
      const matchS = status === "all" || c.status === status;
      return matchQ && matchS;
    });
  }, [data, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const addCustomer = async () => {
    if (!form.name) return toast.error("Name is required");
    try {
      await create({
        name: form.name,
        phone: form.phone || "+91 90000 00000",
        email: form.email || `${form.name.toLowerCase().replace(/\s/g, ".")}@gmail.com`,
        zodiac: form.zodiac,
        nakshatra: "Ashwini",
        birthDate: "1990-01-01",
        birthTime: "12:00 PM",
        birthPlace: "Delhi",
        status: "Lead",
        lastConsultation: "—",
        score: 60,
        avatarHue: Math.floor(Math.random() * 360),
      });
      setOpen(false);
      setForm({ name: "", phone: "", email: "", zodiac: "Aries" });
      toast.success("Customer added 🌟");
    } catch (e) {}
  };

  const remove = async (id: string) => {
    try {
      await deleteCustomer(id);
      toast.success("Customer removed");
    } catch (e) {}
  };

  const openEdit = (c: Customer) => {
    setEditId(c.id);
    setEditForm({ name: c.name, phone: c.phone, email: c.email, zodiac: c.zodiac, status: c.status });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editForm.name.trim() || !editId) return toast.error("Name is required");
    try {
      await update(editId, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim(),
        zodiac: editForm.zodiac,
        status: editForm.status,
      });
      setEditOpen(false);
      setEditId(null);
      toast.success("Customer updated ✏️");
    } catch (e) {}
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading customers...</div>;

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${filtered.length} customers in your practice`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[image:var(--gradient-primary)] shadow-glow">
                <Plus className="h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Add new customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aarav Sharma" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Zodiac</Label>
                    <Select value={form.zodiac} onValueChange={(v) => setForm({ ...form, zodiac: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].map((z) => (
                          <SelectItem key={z} value={z}>{z}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addCustomer} className="bg-[image:var(--gradient-primary)]">Add customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Edit Customer Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="glass-strong">
          <DialogHeader>
            <DialogTitle>Edit customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Full name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <Label>Zodiac</Label>
                <Select value={editForm.zodiac} onValueChange={(v) => setEditForm({ ...editForm, zodiac: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].map((z) => (
                      <SelectItem key={z} value={z}>{z}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="email@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as CustomerStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} className="bg-[image:var(--gradient-primary)]">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search by name, email, phone…" className="bg-secondary/40 pl-9" />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-full bg-secondary/40 sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Lead">Lead</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl glass">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Zodiac</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last Consult</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/40 transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback style={{ background: `oklch(0.5 0.16 ${c.avatarHue})` }} className="text-xs font-semibold text-white">
                          {c.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{c.zodiac}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{c.lastConsultation}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to="/customers/$id" params={{ id: c.id }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-sm">
          <p className="text-muted-foreground">Page {current} of {pages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={current <= 1} onClick={() => setPage(current - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={current >= pages} onClick={() => setPage(current + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

