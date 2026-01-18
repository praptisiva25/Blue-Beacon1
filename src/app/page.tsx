'use client'

import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button onClick={loginWithGoogle} className="bg-black text-white px-6 py-3 rounded">
        Sign in with Google
      </button>
    </div>
  )
}
