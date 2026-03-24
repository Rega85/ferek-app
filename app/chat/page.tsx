'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)
      setLoading(false)
    }

    checkAuth()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCFF00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítání...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat</h1>
          <p className="text-gray-600 mb-6">
            Chat funkcionalita bude brzy dostupná. Zatím můžete komunikovat s prodejci přes kontaktní informace v inzerátech.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Zpět na hlavní stránku
          </button>
        </div>
      </div>
    </div>
  )
}