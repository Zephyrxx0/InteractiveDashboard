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

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
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

    useEffect(() => {
        // Mock onAuthStateChanged
        const checkAuth = () => {
            const storedAuth = localStorage.getItem("isAuth");
            if (storedAuth === "true") {
                setUser(HARDCODED_USER);
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        
        checkAuth();
        
        // if (!auth) {
        //     setLoading(false);
        //     return;
        // }

        // const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        //     if (firebaseUser) {
        //         setUser(formatUser(firebaseUser));
        //     } else {
        //         setUser(null);
        //     }
        //     setLoading(false);
        // });

        // return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        // if (!auth) throw new Error("Firebase auth not initialized");
        // await signInWithEmailAndPassword(auth, email, password);
        
        // Mock sign in
        if (email === "admin" && password === "password123") {
            setUser(HARDCODED_USER);
            localStorage.setItem("isAuth", "true");
        } else {
            throw new Error("Invalid username or password. Use admin / password123 during development.");
        }
    };

    const signInWithGoogle = async () => {
        // if (!auth) throw new Error("Firebase auth not initialized");
        // const provider = new GoogleAuthProvider();
        // await signInWithPopup(auth, provider);
        
        // Mock Google sign in
        setUser(HARDCODED_USER);
        localStorage.setItem("isAuth", "true");
    };

    const signOut = async () => {
        // if (!auth) return;
        // await firebaseSignOut(auth);
        
        // Mock sign out
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
