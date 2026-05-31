'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function AppNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    getSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200/50 bg-white/90 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-3xl font-black tracking-tight text-[#00BFA6] sm:text-4xl">
          Ferek
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/mapa" className="hidden text-sm font-bold text-gray-600 transition-colors hover:text-black md:block">
            Mapa
          </Link>
          <Link href="/listing/new" className="flex items-center gap-1.5 rounded-full bg-[#00BFA6] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Prodat</span>
          </Link>

          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-gray-700 transition-colors hover:text-black">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-sm font-bold">{initials}</div>
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 z-20 mt-3 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                    <div className="border-b border-gray-100 bg-gray-50 p-3">
                      <p className="truncate text-sm font-semibold text-gray-900">{user.user_metadata?.full_name || user.email}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Můj profil</Link>
                      <Link href="/chat" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Zprávy</Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">Odhlásit se</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="hidden text-sm font-medium text-gray-600 hover:text-black sm:block">Přihlásit</Link>
              <Link href="/auth/register" className="rounded-full bg-[#00BFA6] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-600">Registrovat</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
