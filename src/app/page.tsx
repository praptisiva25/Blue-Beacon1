'use client'

import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-blue-900 flex items-center justify-center px-4 text-white">
      <div className="bg-white/95 text-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur">
        
        {/* Logo / Title */}
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2">
          Blue Beacon
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ocean Hazard Reporting System
        </p>

        {/* Description */}
        <div className="mb-8 text-sm text-gray-700 text-center">
          Report dangerous ocean conditions, coastal hazards, and safety issues
          to help protect lives and communities.
        </div>

        {/* Citizen Login */}
        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-60"
        >
          {loading ? (
            'Signing you in...'
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.4 5.4 2.3 13.3l7.8 6.1C12.2 13.3 17.6 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.6c0-1.6-.1-2.7-.4-3.9H24v7.4h12.7c-.6 3.1-2.4 5.7-5.1 7.4l7.9 6.1c4.6-4.2 6.6-10.4 6.6-17z"
                />
                <path
                  fill="#4A90E2"
                  d="M10.1 28.4c-.5-1.3-.8-2.7-.8-4.4s.3-3.1.8-4.4l-7.8-6.1C.8 16.6 0 20.1 0 24s.8 7.4 2.3 10.5l7.8-6.1z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 48c6.2 0 11.6-2 15.4-5.4l-7.9-6.1c-2.2 1.5-5 2.4-7.5 2.4-6.4 0-11.8-3.8-13.9-9.2l-7.8 6.1C6.4 42.6 14.6 48 24 48z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">
            {error}
          </p>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-8 text-center">
          Citizen access only • Secure & private
        </p>
      </div>
    </div>
  )
}
