"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
    const { signIn, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch {
            setError("Google sign-in failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-foreground text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">grid_view</span>
                </div>
                <div>
                    <h1 className="font-display font-bold text-2xl tracking-tight uppercase">Eco-Grid</h1>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">System v2.4</p>
                </div>
            </div>

            {/* Card */}
            <div className="bg-card border border-border p-8">
                <div className="mb-6">
                    <h2 className="font-display text-xl font-bold">Sign In</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Access your project command center
                    </p>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 mb-4 font-mono">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                            Email
                        </label>
                        <Input
                            type="email"
                            placeholder="you@organization.org"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="font-mono text-sm"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                Password
                            </label>
                            <Link
                                href="/login/reset"
                                className="font-mono text-xs text-primary hover:underline uppercase"
                            >
                                Forgot?
                            </Link>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="font-mono text-sm"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full font-mono text-sm uppercase tracking-wider font-bold h-11 shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">or</span>
                    <Separator className="flex-1" />
                </div>

                <Button
                    variant="outline"
                    className="w-full font-mono text-sm uppercase tracking-wider h-11 gap-3"
                    onClick={handleGoogle}
                    disabled={loading}
                >
                    <svg className="size-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-6 font-mono uppercase tracking-wider">
                Don&apos;t have an account?{" "}
                <Link href="#" className="text-primary hover:underline">
                    Contact Admin
                </Link>
            </p>
        </div>
    );
}
