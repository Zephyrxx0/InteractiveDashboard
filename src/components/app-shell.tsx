"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    LayoutDashboard,
    FolderKanban,
    ListChecks,
    BarChart3,
    FileText,
    Users,
    Bell,
    Settings,
    LogOut,
} from "lucide-react";

const mainNav = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Projects", href: "/projects", icon: FolderKanban },
    { title: "Tasks", href: "/tasks", icon: ListChecks },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
];

const managementNav = [
    { title: "Reports", href: "/reports", icon: FileText },
    { title: "Users", href: "/users", icon: Users },
    { title: "Notifications", href: "/notifications", icon: Bell },
];

const configNav = [
    { title: "Settings", href: "/settings", icon: Settings },
];

function AppSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
            <SidebarHeader className="h-16 flex flex-row items-center px-4 border-b border-sidebar-border">
                <Link href="/dashboard" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                    <div className="size-8 bg-foreground text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">grid_view</span>
                    </div>
                    <h1 className="font-display font-bold text-lg tracking-tight uppercase leading-none group-data-[collapsible=icon]:hidden">
                        Eco-Grid
                    </h1>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
                        Main
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNav.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
                        Management
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementNav.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
                        Config
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {configNav.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.title}>
                                        <Link href={item.href}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Sign out" className="text-muted-foreground hover:text-destructive">
                            <LogOut className="size-4" />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <TopBar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

function TopBar() {
    return (
        <header className="h-14 bg-card border-b border-border flex items-center gap-3 px-4 sticky top-0 z-30">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />

            {/* Date / Time */}
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider bg-background/50 px-3 py-1 border border-border">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()} | {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })} UTC</span>
            </div>

            <div className="flex-1" />

            {/* Right actions */}
            <div className="flex items-center gap-3">
                <Link href="/notifications" className="p-2 hover:bg-background transition-colors relative">
                    <Bell className="size-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 size-2 bg-destructive rounded-full border border-card" />
                </Link>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="text-right hidden sm:block">
                        <p className="font-display font-bold text-sm leading-none">J. Doe</p>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase leading-none mt-1">Admin</p>
                    </div>
                    <div className="size-9 bg-background border border-border overflow-hidden">
                        <img
                            alt="Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbWfoVKtueGXExEJZD8_MXdVos9HOsfLb7Z3r99iLYp56Qq5kZmHBWyxBVepuYDGHqF8H_DH-Bndb30rt9ETvI8JFaf7jgnrG2L-SotBE0mH9VqY6qUG23xTF-iPnpGhuzoXhUXlhvJ3DmnJc3OO1TReD74AF44RLORkBWiXG3xEMDp2zSZ4iX7-giVNwWF7AA1skwbEzyTthY9sWNTl3a688KzYMWAePuB5wAd8kosLTVoy-eR3onbRXj0CcU0QUvBPJldHD06cAX"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
