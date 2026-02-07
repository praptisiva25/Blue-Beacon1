'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Report = {
  id: string
  title: string
  urgent: boolean
  createdAt: string
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadReports = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace('/')
      return
    }

    try {
      const res = await fetch(
        'http://localhost:8080/api/citizen/reports/my',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error('Failed to fetch reports')
      }

      const data = await res.json()
      setReports(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  if (loading) {
    return <p className="p-6">Loading reports...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">My Reports</h1>

      {reports.length === 0 && (
        <p className="text-gray-600">No reports submitted yet.</p>
      )}

      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="font-semibold">{r.title}</h2>

            {r.urgent && (
              <p className="text-sm text-red-600 font-medium">
                URGENT
              </p>
            )}

            <p className="text-xs text-gray-400">
              {new Date(r.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
