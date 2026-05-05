'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import AppNavbar from '@/components/AppNavbar'

type Listing = { id: string; title: string; price: number; images: string[] | null; status: string; created_at: string }

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data } = await supabase.from('listings').select('id, title, price, images, status, created_at').eq('user_id', session.user.id).order('created_at', { ascending: false })
      if (data) setListings(data as Listing[])
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
    </div>
  )
  if (!user) return null

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() || 'U'

  return (
    <>
      <AppNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 bg-[#CCFF00] text-black rounded-full flex items-center justify-center font-black text-xl">{initials}</div>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-gray-900">{user.user_metadata?.full_name || 'Uživatel'}</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium hidden sm:block">Odhlásit se</button>
            </div>
            <div className="flex gap-8 text-center">
              <div><p className="text-2xl font-black">{listings.length}</p><p className="text-xs text-gray-500">Inzerátů</p></div>
              <div><p className="text-2xl font-black text-[#CCFF00]">{user.user_metadata?.trust_score || 50}</p><p className="text-xs text-gray-500">Trust score</p></div>
            </div>
          </div>

          {/* Listings */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Moje inzeráty</h2>
            <Link href="/listing/new" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">+ Přidat</Link>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
              <p className="text-5xl mb-4">📦</p>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Zatím žádné inzeráty</h3>
              <p className="text-gray-500 text-sm mb-6">Přidejte svůj první inzerát a začněte prodávat</p>
              <Link href="/listing/new" className="bg-[#CCFF00] text-black px-6 py-3 rounded-full font-bold hover:bg-[#CCFF00]/80 transition-colors inline-block">Přidat inzerát</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {listings.map((listing) => (
                <Link key={listing.id} href={`/listing/${listing.id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📷</div>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' : listing.status === 'sold' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>{listing.status === 'active' ? 'Aktivní' : listing.status === 'sold' ? 'Prodáno' : listing.status}</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{listing.title}</h3>
                    <p className="text-base font-bold mt-0.5">{listing.price === 0 ? 'Zdarma' : `${(listing.price / 100).toLocaleString('cs-CZ')} Kč`}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}