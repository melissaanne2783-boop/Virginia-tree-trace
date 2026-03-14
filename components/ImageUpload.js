"use client"
import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Camera } from 'lucide-react'

export default function ImageUpload({ onUpload }) {
  const [loading, setLoading] = useState(false)
  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLoading(true)
    const path = `trees/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('tree-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('tree-images').getPublicUrl(path)
      onUpload(data.publicUrl)
    }
    setLoading(false)
  }
  return (
    <label className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl cursor-pointer">
      <Camera size={32} className="text-gray-400" />
      <span className="mt-2 text-sm text-gray-500">{loading ? 'Uploading...' : 'Tap to Photo Tree'}</span>
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </label>
  )
}
