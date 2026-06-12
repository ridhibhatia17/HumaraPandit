import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, Sparkles, Zap, Gem, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/pro")({
  component: ProPlanPage,
});

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Essential tools for individual astrologers.",
    features: [
      "Up to 50 Customers",
      "Basic Kundli Generation",
      "Manual Consultation Notes",
      "Standard Support",
    ],
    icon: Shield,
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    buttonText: "Current Plan",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "₹1,999",
    period: "/month",
    description: "Advanced features with AI superpowers for growing practices.",
    features: [
      "Unlimited Customers",
      "Advanced AI Remedy Suggestions",
      "Automated Consultation Summaries",
      "Priority WhatsApp Support",
      "Custom Branding",
    ],
    icon: Crown,
    color: "from-gold/20 to-orange-500/20",
    border: "border-gold/50",
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full suite for large teams and astrology centers.",
    features: [
      "Everything in Pro",
      "Multiple Pandit Accounts",
      "API Access & Integrations",
      "Dedicated Account Manager",
      "White-label App",
    ],
    icon: Gem,
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
  },
];

function ProPlanPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="text-center space-y-4 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold"
        >
          <Sparkles className="h-4 w-4" />
          Unlock Your Full Potential
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        >
          Choose the Perfect <span className="bg-gradient-to-r from-gold to-orange-500 bg-clip-text text-transparent">Plan</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-muted-foreground"
        >
          Scale your Vedic astrology practice with our premium tools. From AI-driven insights to seamless customer management.
        </motion.p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8 pt-8">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className={`relative flex flex-col overflow-hidden rounded-3xl border ${tier.border} bg-background/50 p-8 glass-strong transition-all hover:scale-[1.02]`}
          >
            {tier.popular && (
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-gold to-orange-500 px-3 py-1 text-center text-xs font-bold uppercase tracking-wider text-white">
                Most Popular
              </div>
            )}
            
            <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-20 pointer-events-none`} />
            
            <div className={`mt-${tier.popular ? "6" : "0"} mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/80 shadow-inner`}>
              <tier.icon className={`h-7 w-7 ${tier.popular ? "text-gold" : "text-foreground"}`} />
            </div>
            
            <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
              {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
            </div>
            
            <p className="mt-4 text-sm text-muted-foreground">{tier.description}</p>
            
            <ul className="my-8 flex-1 space-y-4">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className={`h-5 w-5 shrink-0 ${tier.popular ? "text-gold" : "text-primary/70"}`} />
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              variant={tier.buttonVariant}
              className={`w-full rounded-xl py-6 text-base font-semibold ${tier.popular ? "bg-[image:var(--gradient-primary)] shadow-glow text-white border-0 hover:opacity-90" : ""}`}
            >
              {tier.popular && <Zap className="mr-2 h-4 w-4" />}
              {tier.buttonText}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
