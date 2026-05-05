'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '', phone: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) { setError('Hesla se neshodují'); setLoading(false); return }
    if (formData.password.length < 6) { setError('Heslo musí mít alespoň 6 znaků'); setLoading(false); return }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.fullName, phone: formData.phone },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      if (error) setError(error.message)
      else setSuccess('Účet vytvořen! Zkontrolujte svůj e-mail pro potvrzení.')
    } catch {
      setError('Došlo k chybě při registraci')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:border-transparent bg-gray-50 text-gray-900 placeholder:text-gray-400"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black tracking-tight inline-block">
            Férek<span className="text-[#CCFF00]">.</span>
          </Link>
          <p className="text-gray-500 mt-2">Vytvořte si účet zdarma</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">{success}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">E-mail *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="vas@email.cz" />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-1.5">Přezdívka *</label>
              <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} required className={inputCls} placeholder="Vaše jméno nebo přezdívka" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1.5">Telefon <span className="text-gray-400 font-normal">(volitelné)</span></label>
              <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+420 123 456 789" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-1.5">Heslo *</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className={inputCls} placeholder="Minimálně 6 znaků" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-1.5">Heslo znovu *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className={inputCls} placeholder="Zopakujte heslo" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base mt-2">
              {loading ? 'Registrace...' : 'Vytvořit účet'}
            </button>

            <p className="text-[11px] text-gray-400 text-center leading-relaxed">
              Registrací souhlasíte s <Link href="/podminky" className="underline">podmínkami</Link> a <Link href="/ochrana-soukromi" className="underline">ochranou soukromí</Link>.
            </p>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Už máte účet?{' '}
          <Link href="/auth/login" className="text-black font-semibold hover:underline">Přihlaste se</Link>
        </p>
      </div>
    </div>
  )
}