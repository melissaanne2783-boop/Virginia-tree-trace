"use client"
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import TreeMap from '../components/TreeMap';
import ImageUpload from '../components/ImageUpload';
import { Trees, MapPin } from 'lucide-react';

export default function Home() {
  const [sightings, setSightings] = useState([]);
  const [coords, setCoords] = useState(null);
  const [form, setForm] = useState({ species: '', img: '' });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await supabase.from('tree_sightings').select('*');
    setSightings(data || []);
  }

  async function save() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Please log in first!");
    
    await supabase.from('tree_sightings').insert([{
      species: form.species,
      image_url: form.img,
      latitude: coords.lat,
      longitude: coords.lng,
      user_id: user.id
    }]);
    load();
    setForm({ species: '', img: '' });
  }

  return (
    <main className="max-w-4xl mx-auto p-4 pb-20">
      <header className="flex items-center gap-2 py-6">
        <Trees className="text-green-700" size={32} />
        <h1 className="text-2xl font-black text-green-900 italic">Virginia Tree Trace</h1>
      </header>

      <section className="space-y-6">
        <TreeMap sightings={sightings} onMapClick={setCoords} />
        
        <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
          <h2 className="font-bold text-lg">Trace a Sighting</h2>
          <ImageUpload onUpload={(url) => setForm({...form, img: url})} onIdentify={(sp) => setForm({...form, species: sp})} />
          <input 
            value={form.species} 
            onChange={e => setForm({...form, species: e.target.value})}
            placeholder="Species (AI will suggest...)" 
            className="w-full p-4 bg-gray-50 rounded-xl border-none font-bold"
          />
          {coords && <p className="text-xs text-green-600 font-bold">📍 Location Set: {coords.lat.toFixed(3)}, {coords.lng.toFixed(3)}</p>}
          <button onClick={save} className="w-full bg-green-700 text-white py-4 rounded-2xl font-black text-lg">Save to Registry</button>
        </div>
      </section>
    </main>
  );
}
