import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { AIAssistant } from "@/components/layout/AIAssistant";
import { useAuth, ROUTE_ROLES } from "@/lib/auth";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    // wait a tick for localStorage hydration before deciding
    const t = setTimeout(() => {
      if (!isAuthenticated) navigate({ to: "/login" });
    }, 50);
    return () => clearTimeout(t);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cosmic">
        <p className="text-sm text-muted-foreground">Loading your portal…</p>
      </div>
    );
  }

  // Role-based access control for restricted routes
  const restricted = Object.entries(ROUTE_ROLES).find(([path]) => pathname.startsWith(path));
  const allowed = !restricted || restricted[1].includes(user.role);

  return (
    <div className="flex min-h-screen bg-cosmic">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 p-3 lg:block">
        <AppSidebar />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 p-3 lg:hidden"
            >
              <AppSidebar onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          {allowed ? (
            <Outlet />
          ) : (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                <Lock className="h-7 w-7 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold">Restricted area</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                This section is available to Admin accounts only. You're signed in as{" "}
                <span className="font-semibold text-foreground">{user.role}</span>.
              </p>
              <Button className="mt-5" onClick={() => navigate({ to: "/" })}>
                Back to dashboard
              </Button>
            </div>
          )}
        </main>
      </div>

      <AIAssistant />
    </div>
  );
}
