'use client'

import { useEffect, useState, useRef } from 'react'
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
  const [isDragOver, setIsDragOver] = useState(false)
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    city: ''
  })
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<ListingFormData>>({})
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    )

    if (files.length + photos.length > 5) {
      alert('Maximum 5 fotografií')
      return
    }

    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + photos.length > 5) {
      alert('Maximum 5 fotografií')
      return
    }
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const newPhotos = [...photos, ...files]
    setPhotos(newPhotos)

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file))
    setPhotoUrls([...photoUrls, ...newUrls])
  }

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    const newUrls = photoUrls.filter((_, i) => i !== index)

    // Revoke the object URL to free memory
    URL.revokeObjectURL(photoUrls[index])

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

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ListingFormData> = {}

    if (step === 1) {
      if (photos.length === 0) {
        alert('Přidejte alespoň jednu fotografii')
        return false
      }
    } else if (step === 2) {
      if (!formData.title.trim()) newErrors.title = 'Název je povinný'
      if (!formData.description.trim()) newErrors.description = 'Popis je povinný'
      if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Cena musí být větší než 0'
      if (!formData.category) newErrors.category = 'Kategorie je povinná'
      if (!formData.city.trim()) newErrors.city = 'Město je povinné'

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    return true
  }

  const handleSubmit = async () => {
    if (!user || !validateStep(2)) return

    setSubmitting(true)
    try {
      // Upload photos first
      const uploadedPhotoUrls = await uploadPhotos()

      // Create listing
      const { error } = await supabase
        .from('listings')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: Math.round(parseFloat(formData.price) * 100), // Convert to haléře
          category: formData.category,
          city: formData.city.trim(),
          user_id: user.id,
          photos: uploadedPhotoUrls,
          status: 'active'
        })

      if (error) throw error

      // Redirect to homepage
      router.push('/')
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Chyba při vytváření inzerátu. Zkuste to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Přidat inzerát
          </h1>
          <div className="flex items-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-[#CCFF00]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotografie</h2>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Fotka ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        Hlavní foto
                      </div>
                    )}
                  </div>
                ))}

                {/* Upload Area */}
                {photos.length < 5 && (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg h-32 flex items-center justify-center cursor-pointer transition-colors ${
                      isDragOver
                        ? 'border-[#CCFF00] bg-[#CCFF00] bg-opacity-10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-gray-600 text-sm">
                        {isDragOver ? 'Pusťte fotky sem' : 'Přidejte fotky'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">nebo přetáhněte</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500">
                Přidejte až 5 fotografií. První fotografie bude hlavní. Podporované formáty: JPG, PNG, WebP.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Další krok
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informace o inzerátu</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Název *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCFF00] bg-white ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Např. iPhone 12 Pro Max"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Popis *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCFF00] bg-white h-32 resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Podrobný popis vašeho inzerátu..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cena (Kč) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCFF00] bg-white ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="1000"
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCFF00] bg-white ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Vyberte kategorii</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Město *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCFF00] bg-white ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Praha"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-gray-700"
              >
                Zpět
              </button>
              <button
                onClick={nextStep}
                className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
              >
                Další krok
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shrnutí a publikace</h2>

            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Fotka ${index + 1}`}
                    className="w-full h-24 object-cover rounded border border-gray-200"
                  />
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">{formData.title}</h3>
                <p className="text-2xl font-bold text-[#CCFF00] mt-1">
                  {parseFloat(formData.price).toLocaleString('cs-CZ')} Kč
                </p>
                <p className="text-gray-600 mt-2 line-clamp-3">{formData.description}</p>
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <span>Kategorie: {formData.category}</span>
                  <span>Město: {formData.city}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-gray-700"
              >
                Zpět
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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