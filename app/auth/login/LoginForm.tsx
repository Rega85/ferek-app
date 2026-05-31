'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

type GoogleCredentialResponse = {
  credential?: string
}

type GooglePromptMomentNotification = {
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
            ux_mode?: 'popup' | 'redirect'
          }) => void
          prompt: (callback?: (notification: GooglePromptMomentNotification) => void) => void
          cancel: () => void
        }
      }
    }
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState<'google' | 'onetap' | 'magic' | 'password' | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [googleScriptReady, setGoogleScriptReady] = useState(false)
  const oneTapInitializedRef = useRef(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const supabase = useMemo(() => createClient(), [])
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`

  const handleOneTapCredential = useCallback(async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setError('Google One Tap nevrátil přihlašovací token')
      return
    }

    setLoading('onetap')
    setError('')
    setSuccess('')

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })

    if (error) {
      setError(error.message)
      setLoading(null)
      return
    }

    router.push(next)
    router.refresh()
  }, [next, router, supabase])

  useEffect(() => {
    if (!googleClientId || !googleScriptReady || oneTapInitializedRef.current || !window.google) return

    oneTapInitializedRef.current = true
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      ux_mode: 'popup',
      callback: handleOneTapCredential,
    })

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        console.info('Google One Tap not displayed:', notification.getNotDisplayedReason())
      }
      if (notification.isSkippedMoment()) {
        console.info('Google One Tap skipped:', notification.getSkippedReason())
      }
      if (notification.isDismissedMoment()) {
        console.info('Google One Tap dismissed:', notification.getDismissedReason())
      }
    })

    return () => {
      window.google?.accounts.id.cancel()
      oneTapInitializedRef.current = false
    }
  }, [googleClientId, googleScriptReady, handleOneTapCredential])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading('password')
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push(next)
    } catch {
      setError('Došlo k chybě při přihlašování')
    } finally {
      setLoading(null)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading('magic')
    setError('')
    setSuccess('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo(),
          shouldCreateUser: true,
        },
      })
      if (error) setError(error.message)
      else setSuccess('Poslali jsme vám přihlašovací odkaz. Otevřete e-mail a potvrďte přihlášení.')
    } catch {
      setError('Nepodařilo se odeslat magic link')
    } finally {
      setLoading(null)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading('google')
    setError('')
    setSuccess('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo(),
      },
    })
    if (error) {
      setError(error.message)
      setLoading(null)
    }
  }

  return (
    <>
      {googleClientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setGoogleScriptReady(true)}
        />
      )}
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-5xl font-black tracking-tight inline-block text-[#00BFA6]">
            Ferek
          </Link>
          <p className="text-gray-500 mt-3">Přihlášení do bezpečného bazaru</p>
        </div>

        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 sm:p-8">
          <button
            onClick={handleGoogleLogin}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white text-gray-800 py-3.5 rounded-[18px] font-black hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading === 'google' || loading === 'onetap' ? 'Přihlašování...' : 'Pokračovat přes Google'}
          </button>

          <form onSubmit={handleMagicLink} className="space-y-3">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
            {success && <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl text-sm">{success}</div>}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-1.5">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 border border-gray-200 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] bg-gray-50 text-gray-900 placeholder:text-gray-400"
                placeholder="vas@email.cz"
              />
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              className="w-full bg-[#00BFA6] text-white py-3.5 rounded-[18px] font-black hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {loading === 'magic' ? 'Odesílání...' : 'Poslat magic link'}
            </button>
          </form>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm font-bold text-gray-500 hover:text-black"
            >
              {showPassword ? 'Skrýt přihlášení heslem' : 'Přihlásit heslem'}
            </button>
          </div>

          {showPassword && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3 mt-4 pt-4 border-t border-gray-100">
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-1.5">Heslo</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-[#00BFA6] bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  placeholder="Vaše heslo"
                />
              </div>
              <button
                type="submit"
                disabled={loading !== null}
                className="w-full bg-black text-white py-3.5 rounded-[18px] font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading === 'password' ? 'Přihlašování...' : 'Přihlásit heslem'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Nemáte účet?{' '}
          <Link href={`/auth/register${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-black font-semibold hover:underline">Zaregistrujte se</Link>
        </p>
      </div>
      </div>
    </>
  )
}
