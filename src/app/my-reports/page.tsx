'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type Report = {
  id: string
  title: string
  categoryGroup: string
  category: string
  subCategory: string
  severity: string
  urgent: boolean
  createdAt: string
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const router = useRouter()

  const loadReports = async () => {
    // ✅ Get session (JWT)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace('/')
      return
    }

    const res = await fetch('http://localhost:8080/api/reports/my', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (!res.ok) {
      console.error('Failed to fetch reports')
      return
    }

    const json = await res.json()
    setReports(json)
  }

  const deleteReport = async (id: string) => {
    if (!confirm('Delete this report?')) return

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace('/')
      return
    }

    const res = await fetch(
      `http://localhost:8080/api/reports/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )

    if (!res.ok) {
      alert('Failed to delete report')
      return
    }

    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  useEffect(() => {
    loadReports()
  }, [])

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
            className="bg-white p-4 rounded shadow flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{r.title}</h2>
              <p className="text-sm text-gray-600">
                {r.categoryGroup} → {r.category} → {r.subCategory}
              </p>
              <p className="text-sm">
                Severity: {r.severity}
                {r.urgent && ' • URGENT'}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              className="text-red-600 hover:underline"
              onClick={() => deleteReport(r.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
