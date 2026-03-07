"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      {/* Navbar */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-foreground text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight uppercase">
            Eco-Grid <span className="text-muted-foreground font-normal text-sm normal-case ml-1">[SYS v2.4]</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-wider">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 mb-6">
            <span className="size-2 bg-primary rounded-full animate-pulse" />
            <span className="font-mono text-xs text-primary uppercase tracking-wider font-bold">
              System Online
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Your NGO&apos;s
            <br />
            <span className="text-primary">Command Center</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            High-fidelity project management, real-time field data visualization,
            and impact tracking — all in one interface.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="font-mono text-sm uppercase tracking-wider font-bold h-12 px-8 shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 border-t border-border pt-8">
            {[
              { value: "14,203", label: "Beneficiaries Tracked" },
              { value: "8", label: "Active Project Sites" },
              { value: "1,250", label: "Trees Planted" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 flex items-center justify-between">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          © 2026 Eco-Grid System
        </p>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          v2.4 · Status: <span className="text-primary">Operational</span>
        </p>
      </footer>
    </div>
  );
}
