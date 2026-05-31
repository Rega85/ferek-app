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
    <nav className="fixed left-0 right-0 top-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="text-4xl font-black tracking-tight text-[#ff5a1f] sm:text-5xl">
          Ferek
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/mapa" className="hidden text-sm font-bold text-gray-500 transition-colors hover:text-black md:block">
            Mapa
          </Link>
          <Link href="/bezpecnost" className="hidden text-sm font-bold text-gray-500 transition-colors hover:text-black md:block">
            Bezpečnost
          </Link>
          <Link href="/listing/new" className="hidden rounded-full bg-[#ff5a1f] px-5 py-2.5 text-sm font-black text-white shadow-md transition-colors hover:bg-orange-600 sm:block">
            Prodat
          </Link>

          {ready && (
            user ? (
              <Link href="/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff5a1f] text-sm font-black text-white transition-transform hover:scale-105">
                {initials}
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden text-sm font-bold text-gray-600 transition-colors hover:text-black sm:block">
                Přihlásit
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
