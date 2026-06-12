import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Star, Sparkles, Moon, Quote } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cosmic">
      {/* Hero side */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[image:var(--gradient-cosmic)]" />
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: i % 5 === 0 ? 3 : 1.5,
              height: i % 5 === 0 ? 3 : 1.5,
              opacity: 0.2 + ((i * 7) % 60) / 100,
            }}
          />
        ))}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-glow">
              <Star className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-display text-lg font-bold">Humara Pandit</span>
          </Link>

          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute -right-6 -top-24 flex h-40 w-40 items-center justify-center rounded-full border border-gold/20"
            >
              <Moon className="absolute -top-3 h-6 w-6 text-gold/70" />
              <Sparkles className="absolute -bottom-2 left-4 h-5 w-5 text-primary/70" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md font-display text-4xl font-bold leading-tight"
            >
              The modern <span className="text-gradient">CRM</span> built for{" "}
              <span className="text-gradient-gold">astrologers</span>.
            </motion.h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Manage consultations, recommend gemstones & remedies, and grow lasting customer
              relationships — all in one cosmic workspace.
            </p>
          </div>

          <div className="rounded-2xl glass p-5">
            <Quote className="h-5 w-5 text-gold" />
            <p className="mt-2 text-sm text-muted-foreground">
              "Humara Pandit CRM doubled our follow-up conversions in 3 months."
            </p>
            <p className="mt-2 text-xs font-medium">— Acharya Meera Joshi, Senior Astrologer</p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)]">
              <Star className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-display text-lg font-bold">Humara Pandit</span>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </motion.div>
      </div>
    </div>
  );
}
