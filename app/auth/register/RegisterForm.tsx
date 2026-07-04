'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

type OAuthProvider = 'google' | 'facebook'

export default function RegisterForm() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState<'form' | 'google' | 'facebook' | 'seznam' | null>(null)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading('form')
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) { setError('Hesla se neshodují'); setLoading(null); return }
    if (formData.password.length < 6) { setError('Heslo musí mít alespoň 6 znaků'); setLoading(null); return }
    if (!formData.fullName.trim()) { setError('Přezdívka je povinná'); setLoading(null); return }
    if (!formData.phone.trim()) { setError('Telefonní číslo je povinné'); setLoading(null); return }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName, phone: formData.phone },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        }
      })
      if (error) setError(error.message)
      else setSuccess('Účet vytvořen! Zkontrolujte svůj e-mail — klikněte na potvrzovací odkaz.')
    } catch {
      setError('Došlo k chybě při registraci')
    } finally {
      setLoading(null)
    }
  }

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setLoading(provider)
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) {
        setError(error.message)
        setLoading(null)
      }
    } catch {
      setError('Registraci se nepodařilo spustit. Zkontrolujte Supabase URL a nastavení OAuth provideru.')
      setLoading(null)
    }
  }

  const handleSeznamMagicLink = async () => {
    setError('')
    setSuccess('')

    if (!formData.email.trim()) {
      setError('Pro registraci přes Seznam zadejte svůj Seznam e-mail do pole E-mail.')
      return
    }

    setLoading('seznam')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          shouldCreateUser: true,
        },
      })
      if (error) setError(error.message)
      else setSuccess('Poslali jsme registrační odkaz na e-mail. Funguje i pro Seznam.cz účet.')
    } catch {
      setError('Nepodařilo se odeslat registrační odkaz')
    } finally {
      setLoading(null)
    }
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-5xl font-black tracking-tight inline-block text-[#00BFA6]">
            Ferek
          </Link>
          <p className="text-gray-500 mt-2">Vytvořte si účet zdarma</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="space-y-3 mb-5">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading === 'google' ? 'Přesměrování...' : 'Registrovat přes Google'}
            </button>

            <button
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading !== null}
              className="w-full flex items-center justify-center gap-3 border border-[#1877F2]/20 bg-[#1877F2] text-white py-3 rounded-xl font-semibold hover:bg-[#166FE5] transition-colors disabled:opacity-50">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-[#1877F2]">f</span>
              {loading === 'facebook' ? 'Přesměrování...' : 'Registrovat přes Facebook'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">nebo vyplňte formulář</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                <p className="font-semibold mb-1">✓ {success}</p>
                <p className="text-xs text-green-600">Bez potvrzení e-mailu nebudete moci přidat inzeráty.</p>
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-1.5">Jméno / Přezdívka *</label>
              <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required className={inputCls} placeholder="Jak vás uvidí ostatní" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">E-mail *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="vas@email.cz" />
              <p className="text-[11px] text-gray-400 mt-1">Na tento e-mail vám pošleme ověřovací odkaz</p>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1.5">Telefon *</label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className={inputCls} placeholder="+420 123 456 789" />
              <p className="text-[11px] text-gray-400 mt-1">Pro komunikaci s kupujícími</p>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">Heslo *</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className={inputCls} placeholder="Minimálně 6 znaků" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">Heslo znovu *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className={inputCls} placeholder="Zopakujte heslo" />
            </div>

            <button type="submit" disabled={loading !== null}
              className="w-full bg-[#00BFA6] text-white py-3.5 rounded-xl font-bold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base mt-2">
              {loading === 'form' ? 'Vytváření účtu...' : 'Vytvořit účet'}
            </button>

            <button
              type="button"
              onClick={handleSeznamMagicLink}
              disabled={loading !== null}
              className="w-full border border-[#CC0033]/20 bg-white text-[#CC0033] py-3.5 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50">
              {loading === 'seznam' ? 'Odesílání...' : 'Registrovat přes Seznam e-mail'}
            </button>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              Registrací souhlasíte s <Link href="/podminky" className="underline">podmínkami</Link> a <Link href="/ochrana-soukromi" className="underline">ochranou soukromí</Link>.
            </p>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Už máte účet?{' '}
          <Link href={`/auth/login${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-black font-semibold hover:underline">Přihlaste se</Link>
        </p>
      </div>
    </div>
  )
}
