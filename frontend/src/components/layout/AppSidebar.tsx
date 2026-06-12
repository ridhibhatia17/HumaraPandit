import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Gem,
  ListChecks,
  ListTodo,
  BarChart3,
  Bell,
  Sparkles,
  Star,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, type Role } from "@/lib/auth";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  roles?: Role[];
};

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/consultations", label: "Consultations", icon: CalendarClock },
  { to: "/remedies", label: "Remedies & Gems", icon: Gem },
  { to: "/followups", label: "Follow-Ups", icon: ListChecks },
  { to: "/tasks", label: "My Tasks", icon: ListTodo },
  { to: "/team", label: "Team", icon: ShieldCheck, roles: ["Admin"] },
  { to: "/analytics", label: "Analytics", icon: BarChart3, roles: ["Admin"] },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const role = user?.role ?? "Pandit";

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  const visibleNav = nav.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="flex h-full w-[260px] flex-col gap-2 glass-strong p-4">
      <Link to="/" onClick={onNavigate} className="mb-4 flex items-center gap-3 px-2 py-2">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-glow">
          <Star className="h-5 w-5 text-primary-foreground" fill="currentColor" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-base font-bold">Humara Pandit</p>
          <p className="text-xs text-muted-foreground">{role} Portal</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {visibleNav.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-[image:var(--gradient-primary)] opacity-90 shadow-glow"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <item.icon className="relative z-10 h-[18px] w-[18px]" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link to="/pro" onClick={onNavigate} className="block rounded-2xl border border-gold/30 bg-gold/10 p-4 transition-all hover:scale-[1.02] hover:bg-gold/15 active:scale-[0.98]">
        <div className="mb-1 flex items-center gap-2 text-gold">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Pro Plan</span>
        </div>
        <p className="text-xs text-gold/80">
          View plans & upgrade for AI superpowers.
        </p>
      </Link>
    </aside>
  );
}
