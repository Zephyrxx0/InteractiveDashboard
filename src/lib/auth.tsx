"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    // onAuthStateChanged,
    // signInWithEmailAndPassword,
    // signInWithPopup,
    // GoogleAuthProvider,
    // signOut as firebaseSignOut,
    User as FirebaseUser,
} from "firebase/auth";
// import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role?: 'admin' | 'member';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

// const formatUser = (user: FirebaseUser): User => ({
//     uid: user.uid,
//     email: user.email,
//     displayName: user.displayName,
//     photoURL: user.photoURL,
// });

const HARDCODED_USER: User = {
    uid: "admin-dev-01",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "https://i.pravatar.cc/150?u=admin",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', uid)
                .single();
            
            if (error) return null;
            return data.role as 'admin' | 'member';
        } catch (e) {
            return null;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const storedAuth = localStorage.getItem("isAuth");
            if (storedAuth === "true") {
                const role = await fetchProfile(HARDCODED_USER.uid);
                setUser({ ...HARDCODED_USER, role: role || 'admin' });
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        
        checkAuth();
    }, []);

    const signIn = async (email: string, password: string) => {
        const validUser = email === "admin" || email === "admin@example.com";
        if (validUser && password === "password123") {
            const role = await fetchProfile(HARDCODED_USER.uid);
            setUser({ ...HARDCODED_USER, role: role || 'admin' });
            localStorage.setItem("isAuth", "true");
        } else {
            throw new Error("Invalid credentials. Use admin@example.com / password123 during development.");
        }
    };

    const signInWithGoogle = async () => {
        const role = await fetchProfile(HARDCODED_USER.uid);
        setUser({ ...HARDCODED_USER, role: role || 'admin' });
        localStorage.setItem("isAuth", "true");
    };

    const signOut = async () => {
        setUser(null);
        localStorage.removeItem("isAuth");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook for routes that require authentication.
 * Redirects to /login if not authenticated.
 */
export function useRequireAuth() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    return { user, loading };
}
