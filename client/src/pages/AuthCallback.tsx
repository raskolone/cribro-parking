/**
 * Auth Callback — Handles OAuth redirect
 * After Google login, Supabase redirects here with tokens in URL hash.
 * This page processes the tokens and redirects to dashboard.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Once auth state resolves, redirect to dashboard
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      } else {
        // If no user after processing, go to auth page
        navigate("/auth");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Logowanie...</p>
    </div>
  );
}
