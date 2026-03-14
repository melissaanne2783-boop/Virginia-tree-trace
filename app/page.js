"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../lib/supabaseClient'
import ImageUpload from '../components/ImageUpload'
import { Trees } from 'lucide-react'

const TreeMap = dynamic(() => import('../components/TreeMap'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-gray-100 rounded-xl animate-pulse" />
})

export default function Home() {
  const [sightings, setSightings] = useState([])
  const [coords, setCoords] = useState(null)
  const [img, setImg] = useState('')

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('tree_sightings').select('*')
    setSightings(data || [])
  }

  async function save(e) {
    e.preventDefault()
    const species = e.target.species.value
    if (!coords) return alert("Tap map to set location")
    await supabase.from('tree_sightings').insert([{
      species, image_url: img, latitude: coords.lat, longitude: coords.lng, user_id: (await supabase.auth.getUser()).data.user?.id
    }])
    load()
    alert("Tree Traced!")
  }

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 py-4">
        <Trees className="text-green-700" size={32} />
        <h1 className="text-xl font-bold">VA Tree Trace</h1>
      </div>
      <TreeMap sightings={sightings} onMapClick={setCoords} />
      <form onSubmit={save} className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <ImageUpload onUpload={setImg} />
        <input name="species" placeholder="Tree Species" className="w-full p-3 border rounded-lg" required />
        {coords && <p className="text-xs text-green-600 font-bold">📍 Location pinned</p>}
        <button className="w-full bg-green-700 text-white py-3 rounded-lg font-bold">Save Sighting</button>
      </form>
    </main>
  )
}
