import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Humara Pandit CRM" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [role, setRole] = useState<Role>("Pandit");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try {
        signup({ name, email, password, role });
        toast.success(`Account created as ${role}! 🌟`);
        navigate({ to: "/" });
      } catch (err: any) {
        toast.error(err.message || "Failed to sign up");
        setLoading(false);
      }
    }, 700);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join thousands of astrologers growing with Humara Pandit."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {(["Pandit", "Admin"] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-xl border p-3 text-left text-sm transition-colors",
                role === r
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Sparkles className={cn("mb-1 h-4 w-4", role === r ? "text-primary" : "")} />
              <p className="font-medium">{r}</p>
              <p className="text-xs text-muted-foreground">
                {r === "Admin" ? "Full access" : "Consultations & remedies"}
              </p>
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Pandit Raghav Shastri" className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-primary)] shadow-glow">
          {loading ? "Creating…" : "Create account"} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </AuthShell>
  );
}
