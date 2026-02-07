'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      // 🔒 Block officials from citizen dashboard
      const role = session.user.user_metadata?.role
      if (role === 'official') {
        router.replace('/authority-dashboard')
        return
      }

      setEmail(session.user.email ?? null)

      try {
        // 🔹 Sync user ONCE
        const syncRes = await fetch(
          'http://localhost:8080/api/auth/sync',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )

        if (!syncRes.ok) {
          throw new Error('User sync failed')
        }

        setLoading(false)
      } catch (err) {
        console.error('Dashboard init failed:', err)
        await supabase.auth.signOut()
        router.replace('/')
      }
    }

    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return <p className="p-6">Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            Citizen Dashboard
          </h1>
          <p className="text-gray-600">
            Logged in as {email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => router.push('/report')}
          className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700"
        >
          <h2 className="text-xl font-bold mb-2">
            ➕ Report an Issue
          </h2>
          <p>Upload photos and describe the problem</p>
        </div>

        <div
          onClick={() => router.push('/my-reports')}
          className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700"
        >
          <h2 className="text-xl font-bold mb-2">
            📄 My Reports
          </h2>
          <p className="text-gray-200">
            View status of issues you reported
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-2">
            📊 Community Impact
          </h2>
          <p className="text-gray-600">
            Track reported and resolved hazards
          </p>
        </div>
      </div>
    </div>
  )
}
