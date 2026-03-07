"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Wire to Firebase sendPasswordResetEmail
        setSent(true);
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
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Password Reset</p>
                </div>
            </div>

            <div className="bg-card border border-border p-8">
                {sent ? (
                    <div className="text-center">
                        <div className="size-12 bg-primary/10 text-primary mx-auto flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
                        </div>
                        <h2 className="font-display text-xl font-bold mb-2">Check Your Email</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            We sent a password reset link to <strong className="text-foreground">{email}</strong>
                        </p>
                        <Link href="/login">
                            <Button variant="outline" className="font-mono text-sm uppercase tracking-wider">
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="font-display text-xl font-bold">Reset Password</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Enter your email and we&apos;ll send you a reset link
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                                    Email Address
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
                            <Button
                                type="submit"
                                className="w-full font-mono text-sm uppercase tracking-wider font-bold h-11 shadow-[var(--shadow-brutal)] hover:shadow-[var(--shadow-brutal-hover)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                            >
                                Send Reset Link
                            </Button>
                        </form>
                        <p className="text-center text-xs text-muted-foreground mt-6 font-mono uppercase tracking-wider">
                            Remember your password?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
