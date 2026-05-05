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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight">
          Férek<span className="text-[#CCFF00]">.</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/listing/new" className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Prodat</span>
          </Link>

          {loading ? (
            <div className="w-9 h-9 bg-gray-200 animate-pulse rounded-full"></div>
          ) : user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center font-bold text-sm">{initials}</div>
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.user_metadata?.full_name || user.email}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Můj profil</Link>
                      <Link href="/chat" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>Zprávy</Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Odhlásit se</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login" className="text-gray-600 hover:text-black text-sm font-medium hidden sm:block">Přihlásit</Link>
              <Link href="/auth/register" className="bg-[#CCFF00] text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-[#CCFF00]/80 transition-colors">Registrovat</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
