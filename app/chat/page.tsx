'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import AppNavbar from '@/components/AppNavbar'

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/auth/login'); return }
      setUser(session.user)
      setLoading(false)
    }
    checkAuth()
  }, [supabase.auth, router])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
    </div>
  )

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
            <p className="text-5xl mb-4">💬</p>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Zprávy</h1>
            <p className="text-gray-500 mb-8">
              Chat bude brzy dostupný. Zatím můžete komunikovat s prodejci přes kontaktní informace v inzerátech.
            </p>
            <button onClick={() => router.push('/')} className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
              Zpět na hlavní stránku
            </button>
          </div>
        </div>
      </div>
    </>
  )
}