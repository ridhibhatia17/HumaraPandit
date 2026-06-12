import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "Admin" | "Pandit";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  createdAt: string;
}

export interface AuthUser extends Omit<User, "password"> {
  initials: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: Omit<User, "id" | "createdAt" | "name">) => void;
  signup: (data: Omit<User, "id" | "createdAt">) => void;
  logout: () => void;
}

const STORAGE_KEY = "hp-current-user";
const USERS_DB_KEY = "hp-users-db";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function initialsFrom(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const DEFAULT_USERS: User[] = [
  { id: "1", name: "Ridhi", email: "ridhi@gmail.com", password: "password", role: "Admin", createdAt: new Date().toISOString() },
  { id: "2", name: "Aman", email: "aman@gmail.com", password: "password", role: "Admin", createdAt: new Date().toISOString() },
  { id: "3", name: "Raghav", email: "raghav@gmail.com", password: "password", role: "Pandit", createdAt: new Date().toISOString() },
  { id: "4", name: "Mohan", email: "mohan@gmail.com", password: "password", role: "Pandit", createdAt: new Date().toISOString() }
];

function getUsersDb(): User[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const raw = window.localStorage.getItem(USERS_DB_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as User[];
    } catch {
      return DEFAULT_USERS;
    }
  }
  window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // ensure db is seeded
    getUsersDb();
    
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw) as AuthUser);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login: ({ email, password, role }) => {
        const db = getUsersDb();
        const found = db.find((u) => u.email === email && u.role === role);
        if (!found || found.password !== password) {
          throw new Error("Invalid credentials");
        }
        
        const next: AuthUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
          createdAt: found.createdAt,
          initials: initialsFrom(found.name),
        };
        setUser(next);
        if (typeof window !== "undefined")
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
      signup: ({ name, email, password, role }) => {
        const db = getUsersDb();
        if (db.some((u) => u.email === email)) {
          throw new Error("Account with this email already exists");
        }
        
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 11),
          name,
          email,
          password,
          role,
          createdAt: new Date().toISOString()
        };
        db.push(newUser);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
        }

        const next: AuthUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
          initials: initialsFrom(newUser.name),
        };
        setUser(next);
        if (typeof window !== "undefined")
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
      logout: () => {
        setUser(null);
        if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Which roles can access each route path. Routes not listed are open to all roles.
export const ROUTE_ROLES: Record<string, Role[]> = {
  "/analytics": ["Admin"],
  "/team": ["Admin"],
  "/notifications": ["Admin", "Pandit"],
};
