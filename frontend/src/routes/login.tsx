import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Humara Pandit CRM" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("Pandit");
  const [email, setEmail] = useState("raghav@gmail.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      try {
        login({ email, password, role });
        toast.success(`Welcome back, ${role}! 🔮`);
        navigate({ to: "/" });
      } catch (err: any) {
        toast.error(err.message || "Invalid credentials");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <AuthShell
      title="Sign in to your portal"
      subtitle="Choose your role to enter the matching dashboard."
      footer={
        <>
          New to Humara Pandit?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { r: "Pandit", icon: Star, desc: "Consultations & remedies" },
              { r: "Admin", icon: ShieldCheck, desc: "Full access & analytics" },
            ] as const
          ).map(({ r, icon: Icon, desc }) => (
            <button
              type="button"
              key={r}
              onClick={() => {
                setRole(r);
                setEmail(r === "Admin" ? "ridhi@gmail.com" : "raghav@gmail.com");
              }}
              className={cn(
                "rounded-xl border p-3 text-left text-sm transition-colors",
                role === r
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("mb-1 h-4 w-4", role === r ? "text-primary" : "")} />
              <p className="font-medium">{r}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </button>
          ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-[image:var(--gradient-primary)] shadow-glow">
          {loading ? "Signing in…" : `Sign in as ${role}`} <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">Demo credentials are pre-filled — just click Sign in.</p>
      </form>
    </AuthShell>
  );
}
