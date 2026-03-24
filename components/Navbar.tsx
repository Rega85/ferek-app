'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
    setDropdownOpen(false);
  };

  const getUserInitials = (user: User) => {
    const name = user.user_metadata?.full_name;
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0].toUpperCase() || 'U';
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
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 text-muted-foreground hover:text-foreground"
              >
                <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-medium text-sm">
                  {getUserInitials(user)}
                </div>
                <span className="font-medium">
                  {user.user_metadata?.full_name || 'Uživatel'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-20">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Můj profil
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Moje inzeráty
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        Odhlásit se
                      </button>
                    </div>
                  </div>
                </>
              )}
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