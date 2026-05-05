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
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-border px-4 py-3 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-3xl font-display font-extrabold tracking-tight text-foreground">
            Férek<span className="text-accent-dark">.</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-border px-4 py-3 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <Link href="/" className="text-3xl font-display font-extrabold tracking-tight text-foreground hover:opacity-80 transition-opacity">
          Férek<span className="text-accent-dark">.</span>
        </Link>

        <div className="flex items-center space-x-3 md:space-x-6">
          <Link
            href="/listing/new"
            className="bg-accent-dark text-white px-5 py-2 md:py-2.5 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-md flex items-center"
          >
            <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Prodat</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 border border-gray-200 text-gray-800 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {getUserInitials(user)}
                </div>
                <span className="font-medium hidden md:block">
                  {user.user_metadata?.full_name?.split(' ')[0] || 'Uživatel'}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform hidden md:block ${dropdownOpen ? 'rotate-180' : ''}`}
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
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-border">
                      <p className="font-semibold text-gray-900 truncate">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-accent-dark"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Můj profil
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-accent-dark"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Moje inzeráty
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Odhlásit se
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-black font-medium transition-colors hidden sm:block">
                Přihlásit se
              </Link>
              <Link href="/auth/register" className="bg-accent text-accent-dark px-5 py-2 rounded-full font-bold hover:bg-accent/90 transition-colors shadow-sm">
                Registrovat
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}