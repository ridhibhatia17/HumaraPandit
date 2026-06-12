import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { notifications } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export function TopNavbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 glass px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers, consultations, remedies…"
          className="border-border/60 bg-secondary/50 pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full border border-border/60 bg-secondary/50 py-1 pl-1 pr-3 transition-colors hover:bg-secondary">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[image:var(--gradient-primary)] text-xs font-bold text-primary-foreground">
                  {user?.initials ?? "HP"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-none">{user?.name ?? "Guest"}</p>
                <Badge
                  variant="outline"
                  className="mt-0.5 h-4 border-gold/40 px-1 text-[9px] text-gold"
                >
                  {(user?.role ?? "Pandit").toUpperCase()}
                </Badge>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/" className="flex cursor-pointer items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
