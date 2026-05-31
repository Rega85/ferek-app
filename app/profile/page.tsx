'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'
import AppNavbar from '@/components/AppNavbar'

type Listing = {
  id: string
  title: string
  price: number
  images: string[] | null
  status: 'active' | 'sold' | 'deleted' | 'paused'
  neklikni_score: number | null
  neklikni_verdict: 'safe' | 'warning' | 'danger' | null
  created_at: string
}

const statusLabel = {
  active: 'Aktivní',
  sold: 'Prodáno',
  paused: 'Pozastaveno',
  deleted: 'Smazáno',
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/auth/login'); return }
      setUser(session.user)
      const { data } = await supabase
        .from('listings')
        .select('id, title, price, images, status, neklikni_score, neklikni_verdict, created_at')
        .eq('user_id', session.user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })
      if (data) setListings(data as Listing[])
      setLoading(false)
    }
    checkAuth()
  }, [supabase, router])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  const updateListingStatus = async (listingId: string, status: Listing['status']) => {
    setUpdatingId(listingId)
    const { error } = await supabase
      .from('listings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', listingId)

    if (!error) {
      setListings(prev => prev.map(listing => listing.id === listingId ? { ...listing, status } : listing))
    }
    setUpdatingId(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-black"></div>
    </div>
  )
  if (!user) return null

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() || 'U'

  const activeCount = listings.filter(listing => listing.status === 'active').length
  const soldCount = listings.filter(listing => listing.status === 'sold').length
  const verifiedCount = listings.filter(listing => listing.neklikni_verdict === 'safe').length

  return (
    <>
      <AppNavbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 bg-[#CCFF00] text-black rounded-full flex items-center justify-center font-black text-xl">{initials}</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-black text-gray-900 truncate">{user.user_metadata?.full_name || 'Uživatel'}</h1>
                <p className="text-gray-500 text-sm truncate">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-bold hidden sm:block">Odhlásit se</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-2xl font-black">{listings.length}</p><p className="text-xs text-gray-500">Inzerátů celkem</p></div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-2xl font-black">{activeCount}</p><p className="text-xs text-gray-500">Aktivních</p></div>
              <div className="bg-gray-50 rounded-lg p-4"><p className="text-2xl font-black">{soldCount}</p><p className="text-xs text-gray-500">Prodaných</p></div>
              <div className="bg-black text-white rounded-lg p-4"><p className="text-2xl font-black">{verifiedCount}</p><p className="text-xs text-gray-400">Ověřených</p></div>
            </div>
          </section>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black">Moje inzeráty</h2>
              <p className="text-sm text-gray-500">Správa stavu nabídky a bezpečnostní kontrola.</p>
            </div>
            <Link href="/listing/new" className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Přidat</Link>
          </div>

          {listings.length === 0 ? (
            <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
              <h3 className="text-lg font-black text-gray-900 mb-1">Zatím žádné inzeráty</h3>
              <p className="text-gray-500 text-sm mb-6">Přidejte svůj první inzerát a začněte prodávat.</p>
              <Link href="/listing/new" className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-black hover:bg-lime-300 transition-colors inline-block">Přidat inzerát</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <article key={listing.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                  <Link href={`/listing/${listing.id}`} className="block aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">+</div>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold ${
                      listing.status === 'active' ? 'bg-green-100 text-green-800' : listing.status === 'sold' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                    }`}>{statusLabel[listing.status]}</span>
                  </Link>
                  <div className="p-4">
                    <Link href={`/listing/${listing.id}`} className="font-bold text-gray-900 line-clamp-1 hover:underline">{listing.title}</Link>
                    <p className="text-lg font-black mt-1">{listing.price === 0 ? 'Zdarma' : `${(listing.price / 100).toLocaleString('cs-CZ')} Kč`}</p>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-gray-500">Neklikni</span>
                      <span className={`font-black ${
                        listing.neklikni_verdict === 'danger' ? 'text-red-600' : listing.neklikni_verdict === 'warning' ? 'text-amber-600' : 'text-green-600'
                      }`}>{listing.neklikni_score ?? '-'} / 100</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {listing.status !== 'active' && (
                        <button disabled={updatingId === listing.id} onClick={() => updateListingStatus(listing.id, 'active')} className="bg-[#CCFF00] text-black rounded-lg py-2 text-sm font-bold disabled:opacity-50">Aktivovat</button>
                      )}
                      {listing.status !== 'sold' && (
                        <button disabled={updatingId === listing.id} onClick={() => updateListingStatus(listing.id, 'sold')} className="bg-blue-50 text-blue-700 rounded-lg py-2 text-sm font-bold disabled:opacity-50">Prodáno</button>
                      )}
                      {listing.status !== 'paused' && (
                        <button disabled={updatingId === listing.id} onClick={() => updateListingStatus(listing.id, 'paused')} className="bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-bold disabled:opacity-50">Pozastavit</button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
