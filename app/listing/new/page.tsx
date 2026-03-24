'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

type ListingFormData = {
  title: string
  description: string
  price: string
  category: string
  city: string
}

const CATEGORIES = [
  'Elektronika',
  'Oblečení',
  'Domácnost',
  'Auto-moto',
  'Sport',
  'Zvířata',
  'Knihy',
  'Hračky',
  'Ostatní'
]

export default function NewListingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    city: ''
  })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photos.length > 5) {
      alert('Maximum 5 fotografií')
      return
    }

    const newPhotos = [...photos, ...files]
    setPhotos(newPhotos)

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file))
    setPhotoUrls([...photoUrls, ...newUrls])
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newUrls = photoUrls.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    setPhotoUrls(newUrls)
  }

  const uploadPhotos = async (): Promise<string[]> => {
    const uploadedUrls: string[] = []

    for (const photo of photos) {
      const fileExt = photo.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = `listings/${user!.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, photo)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath)

      uploadedUrls.push(data.publicUrl)
    }

    return uploadedUrls
  }

  const handleSubmit = async () => {
    if (!user) return

    setSubmitting(true)
    try {
      // Upload photos first
      const photoUrls = await uploadPhotos()

      // Create listing
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          title: formData.title,
          description: formData.description,
          price: Math.round(parseFloat(formData.price) * 100), // Convert to haléře
          category: formData.category,
          city: formData.city,
          user_id: user.id,
          photos: photoUrls,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      // Redirect to listing detail
      router.push(`/listing/${listing.id}`)
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Chyba při vytváření inzerátu')
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && photos.length === 0) {
      alert('Přidejte alespoň jednu fotografii')
      return
    }
    if (currentStep === 2 && (!formData.title || !formData.description || !formData.price || !formData.category || !formData.city)) {
      alert('Vyplňte všechna povinná pole')
      return
    }
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Načítání...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Přidat inzerát
          </h1>
          <div className="flex items-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-accent' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Fotografie</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Fotka ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <div className="border-2 border-dashed border-muted rounded-lg h-32 flex items-center justify-center">
                    <label className="cursor-pointer text-center">
                      <div className="text-muted-foreground mb-2">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Přidat fotku
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Přidejte až 5 fotografií. První fotografie bude hlavní.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-medium hover:bg-accent/90"
              >
                Další
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Detaily inzerátu</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Název *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Např. iPhone 12 Pro Max"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Popis *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent h-32"
                placeholder="Podrobný popis vašeho inzerátu..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cena (Kč) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Kategorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value="">Vyberte kategorii</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Město *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Praha"
                required
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted"
              >
                Zpět
              </button>
              <button
                onClick={nextStep}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-medium hover:bg-accent/90"
              >
                Další
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Přehled inzerátu</h2>

            <div className="bg-muted p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Fotka ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-lg">{formData.title}</h3>
                <p className="text-2xl font-bold text-accent mt-1">
                  {parseFloat(formData.price).toLocaleString('cs-CZ')} Kč
                </p>
                <p className="text-muted-foreground mt-2">{formData.description}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                  <span>Kategorie: {formData.category}</span>
                  <span>Město: {formData.city}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted"
              >
                Zpět
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
              >
                {submitting ? 'Publikování...' : 'Publikovat inzerát'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}