'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Report = {
  id: string
  title: string
  description: string
  urgent: boolean
  latitude: number
  longitude: number
  status: string
  imageUrl?: string
  createdAt: string
}

export default function AuthorityReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/')
        return
      }

      const res = await fetch(
        'http://localhost:8080/api/reports/assigned',
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      )

      if (!res.ok) {
        router.replace('/')
        return
      }

      const data = await res.json()
      setReports(data)
      setLoading(false)
    }

    fetchReports()
  }, [router])

  if (loading) {
    return <p className="p-6">Loading reports...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Assigned Reports
        </h1>

        <button
          onClick={() => router.push('/authority-dashboard')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          ← Back
        </button>
      </div>

      {reports.length === 0 ? (
        <p className="text-gray-600">
          No reports assigned to you.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-xl shadow bg-white border-l-4 ${
                r.urgent
                  ? 'border-red-500'
                  : 'border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold">
                  {r.title}
                </h2>

                {r.urgent && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                    URGENT
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-3">
                {r.description}
              </p>

              <p className="text-sm text-gray-500 mb-2">
                Status: <b>{r.status}</b>
              </p>

              <p className="text-xs text-gray-400">
                Reported on{' '}
                {new Date(r.createdAt).toLocaleString()}
              </p>

              {r.imageUrl && (
                <img
                  src={r.imageUrl}
                  alt="Report"
                  className="mt-3 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
