'use client'

import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
  setError(null)

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })

  if (error) {
    setError(error.message)
  }
}


  // Authority login (email + password)
  const loginWithEmailPassword = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white">
      <div className="bg-white text-black p-10 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Blue Beacon
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Ocean Hazard Reporting
        </p>

        {/* Authority Login */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Authority Login</h2>

          <input
            type="email"
            placeholder="Official email"
            className="w-full border p-2 mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={loginWithEmailPassword}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in as Authority'}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Citizen Login */}
        <button
          onClick={loginWithGoogle}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Sign in with Google
        </button>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
