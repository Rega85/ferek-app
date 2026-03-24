'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

type Listing = {
  id: string
  title: string
  price: number
  photos: string[]
  status: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
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

      // Fetch user's listings
      const { data: userListings, error } = await supabase
        .from('listings')
        .select('id, title, price, photos, status, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error && userListings) {
        setListings(userListings)
      }

      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  const getUserInitials = (user: User) => {
    const name = user.user_metadata?.full_name
    if (name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.email?.[0].toUpperCase() || 'U'
  }

  const formatPrice = (price: number) => {
    return (price / 100).toLocaleString('cs-CZ') + ' Kč'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600'
      case 'sold': return 'text-blue-600'
      case 'deleted': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktivní'
      case 'sold': return 'Prodáno'
      case 'deleted': return 'Smazáno'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Načítání profilu...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-xl">
              {getUserInitials(user)}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {user.user_metadata?.full_name || 'Uživatel'}
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-muted-foreground">Trust score</p>
                <p className="text-2xl font-bold text-accent">
                  {user.user_metadata?.trust_score || 50}/100
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inzerátů</p>
                <p className="text-2xl font-bold">{listings.length}</p>
              </div>
            </div>

            <button className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent/90">
              Upravit profil
            </button>
          </div>
        </div>

        {/* Listings Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Moje inzeráty</h2>
            <Link
              href="/listing/new"
              className="bg-accent text-accent-foreground px-4 py-2 rounded-lg font-medium hover:bg-accent/90"
            >
              Přidat inzerát
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-lg">Žádné inzeráty</p>
                <p className="text-sm">Začněte tím, že přidáte svůj první inzerát</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.id}`}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-muted relative">
                    {listing.photos && listing.photos.length > 0 ? (
                      <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                      listing.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : listing.status === 'sold'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(listing.status)}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-lg font-bold text-accent">
                      {formatPrice(listing.price)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(listing.created_at).toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}