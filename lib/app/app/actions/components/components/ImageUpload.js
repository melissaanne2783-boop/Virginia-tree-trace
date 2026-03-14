"use client"
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { identifyTree } from '../app/actions/identifyTree';
import { Camera, Sparkles, Loader2 } from 'lucide-react';

export default function ImageUpload({ onUpload, onIdentify }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setPreview(URL.createObjectURL(file));

    const path = `trees/${Math.random()}-${file.name}`;
    const { error } = await supabase.storage.from('tree-images').upload(path, file);
    
    if (!error) {
      const { data } = supabase.storage.from('tree-images').getPublicUrl(path);
      onUpload(data.publicUrl);
      // Automatically trigger AI
      const aiResult = await identifyTree(data.publicUrl);
      if (aiResult) onIdentify(aiResult.species);
    }
    setLoading(false);
  };

  return (
    <div className="border-2 border-dashed border-green-200 rounded-2xl p-6 text-center">
      {preview ? (
        <img src={preview} className="h-48 w-full object-cover rounded-xl mb-4" />
      ) : (
        <Camera className="mx-auto text-green-300 mb-2" size={48} />
      )}
      <label className="bg-green-600 text-white px-6 py-2 rounded-full font-bold cursor-pointer hover:bg-green-700">
        {loading ? <Loader2 className="animate-spin inline mr-2" /> : <Camera className="inline mr-2" />}
        Capture Tree
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  );
}
