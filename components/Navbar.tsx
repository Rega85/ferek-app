'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <nav className="bg-background border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-foreground">
            Férek<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold text-foreground">
          Férek<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/listing/new"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium hover:bg-accent/90 transition-opacity"
          >
            Přidat inzerát
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground font-medium"
              >
                Odhlásit se
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                Přihlásit se
              </Link>
              <Link href="/auth/register" className="text-accent hover:text-accent/80 font-medium">
                Registrovat
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}