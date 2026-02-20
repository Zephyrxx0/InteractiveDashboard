import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeNav?: "dashboard" | "projects" | "blueprint" | "import" | "reports";
}

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/" },
  { key: "projects", label: "Project Hub", href: "/projects" },
  { key: "blueprint", label: "Blueprint", href: "/projects/WTR-2024-882" },
  { key: "import", label: "Data Import", href: "/import" },
] as const;

export function Header({ activeNav = "dashboard" }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-8 bg-foreground text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight uppercase">
            Eco-Grid
            <span className="text-muted-foreground font-normal text-sm normal-case ml-1">
              [SYS v2.4]
            </span>
          </h1>
        </Link>
        <nav className="hidden md:flex items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`h-16 flex items-center px-4 text-sm font-mono uppercase transition-colors border-b-2 ${
                activeNav === item.key
                  ? "text-foreground bg-background border-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-background border-transparent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-6">
        {/* Date/Time */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider bg-background/50 px-3 py-1 border border-border">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>FEB 20 | 14:00 UTC</span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <span className="material-symbols-outlined text-muted-foreground">notifications</span>
            <span className="absolute top-2 right-2 size-2 bg-destructive rounded-full border border-card" />
          </Button>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="font-display font-bold text-sm leading-none">J. Doe</p>
              <p className="font-mono text-[10px] text-muted-foreground uppercase leading-none mt-1">Admin</p>
            </div>
            <div className="size-9 bg-background border border-border overflow-hidden">
              <img
                alt="Profile picture of J. Doe"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbWfoVKtueGXExEJZD8_MXdVos9HOsfLb7Z3r99iLYp56Qq5kZmHBWyxBVepuYDGHqF8H_DH-Bndb30rt9ETvI8JFaf7jgnrG2L-SotBE0mH9VqY6qUG23xTF-iPnpGhuzoXhUXlhvJ3DmnJc3OO1TReD74AF44RLORkBWiXG3xEMDp2zSZ4iX7-giVNwWF7AA1skwbEzyTthY9sWNTl3a688KzYMWAePuB5wAd8kosLTVoy-eR3onbRXj0CcU0QUvBPJldHD06cAX"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
