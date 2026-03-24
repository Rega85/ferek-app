'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  location_city: string
  images: string[]
  user_id: string
  status: string
  created_at: string
  user?: {
    nickname: string
  }
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    const fetchListing = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:user_id (
            nickname
          )
        `)
        .eq('id', params.id)
        .eq('status', 'active')
        .single()

      if (error) {
        console.error('Error fetching listing:', error)
        return
      }

      setListing(data)
    }

    Promise.all([checkAuth(), fetchListing()]).then(() => {
      setLoading(false)
    })
  }, [params.id, supabase])

  const formatPrice = (price: number) => {
    if (price === 0) return 'Zdarma'
    return `${(price / 100).toLocaleString('cs-CZ')} Kč`
  }

  const nextPhoto = () => {
    if (listing && currentPhotoIndex < listing.images.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1)
    }
  }

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1)
    }
  }

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

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Inzerát nenalezen</h1>
            <p className="text-gray-600 mb-6">
              Tento inzerát neexistuje nebo byl odstraněn.
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Photo Gallery */}
          <div className="relative">
            <div className="aspect-square bg-gray-100 relative">
              {listing.images && listing.images.length > 0 ? (
                <>
                  <img
                    src={listing.images[currentPhotoIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        disabled={currentPhotoIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextPhoto}
                        disabled={currentPhotoIndex === listing.images.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {listing.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`w-2 h-2 rounded-full ${
                              index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Žádná fotografie
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <p className="text-3xl font-bold text-[#CCFF00]">{formatPrice(listing.price)}</p>
              </div>
              {user && user.id !== listing.user_id && (
                <button
                  onClick={() => router.push('/chat')}
                  className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Napsat prodejci
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>Kategorie: {listing.category}</span>
              <span>Město: {listing.location_city}</span>
              <span>Uživatel: {listing.user?.nickname || 'Neznámý'}</span>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Popis</h2>
              <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Zpět
          </button>
        </div>
      </div>
    </div>
  )
}