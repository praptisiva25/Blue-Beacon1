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
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">
          Authority Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => router.push('/authority/reports')}
          className="bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700 text-left"
        >
          <h2 className="text-xl font-bold mb-2">
            📄 Assigned Reports
          </h2>
          <p className="text-blue-100">
            View and manage reports assigned to you
          </p>
        </button>
      </div>
    </div>
  )
}
