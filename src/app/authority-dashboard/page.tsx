'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AuthorityDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authority Dashboard</h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Authority content goes here */}
    </div>
  )
}
