'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

import { CATEGORIES } from '../../../lib/categories'
import MapLibrePicker from '../../../components/MapLibrePicker'

type CategoryGroup = keyof typeof CATEGORIES
type Severity = 'LOW' | 'MEDIUM' | 'HIGH'

export default function ReportPage() {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [urgent, setUrgent] = useState(false)

  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)

  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Upload image to Supabase Storage
  const uploadImage = async (file: File, userId: string) => {
    const ext = file.name.split('.').pop()
    const filePath = `${userId}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('reports')
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from('reports')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const submit = async () => {
    if (
  
      !title ||
      !image ||
      lat === null ||
      lng === null
    ) {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)

    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      router.replace('/')
      return
    }

    try {
      // Upload image
      const imageUrl = await uploadImage(image, session.user.id)

      // Send report to backend (JWT auth)
      await fetch('http://localhost:8080/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title,
          description,
          urgent,
          latitude: lat,
          longitude: lng,
          imageUrl,
        }),
      })

      alert('Report submitted')
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>


        <input
          className="w-full border p-2 mb-3"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Description (optional)"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          Mark as urgent
        </label>

        <div className="mb-4">
          <p className="font-semibold mb-2">Select location</p>
          <MapLibrePicker
            onSelect={(latitude, longitude) => {
              setLat(latitude)
              setLng(longitude)
            }}
          />
          {lat && lng && (
            <p className="text-sm text-gray-600 mt-2">
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  )
}
