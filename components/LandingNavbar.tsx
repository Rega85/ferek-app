'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function LandingNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight">
          Férek<span className="text-[#CCFF00]">.</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/mapa" className="text-gray-500 hover:text-black text-sm font-medium hidden md:block transition-colors">
            Mapa
          </Link>
          <Link href="/bezpecnost" className="text-gray-500 hover:text-black text-sm font-medium hidden md:block transition-colors">
            Bezpečnost
          </Link>

          <Link href="/listing/new" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
            Začít prodávat
          </Link>

          {ready && (
            user ? (
              <Link href="/profile" className="w-9 h-9 bg-[#CCFF00] text-black rounded-full flex items-center justify-center font-bold text-sm hover:scale-105 transition-transform">
                {initials}
              </Link>
            ) : (
              <Link href="/auth/login" className="text-gray-600 hover:text-black text-sm font-semibold hidden sm:block transition-colors">
                Přihlásit
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
