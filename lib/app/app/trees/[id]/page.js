import { supabase } from '@/lib/supabaseClient';
import Comments from '@/components/Comments';

export default async function TreePage({ params }) {
  const { data: tree } = await supabase.from('tree_sightings').select('*').eq('id', params.id).single();

  if (!tree) return <div className="p-10">Tree not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img src={tree.image_url} className="w-full h-80 object-cover rounded-3xl mb-6 shadow-xl" />
      <h1 className="text-4xl font-black text-green-900">{tree.species}</h1>
      <p className="text-gray-500 mt-2 italic">A part of the Virginia Forest Trace</p>
      
      <div className="mt-8 p-6 bg-white border rounded-3xl">
        <h2 className="font-bold text-xl mb-2">Observation Notes</h2>
        <p className="text-gray-700 leading-relaxed">Recorded at {new Date(tree.created_at).toLocaleDateString()}. Location: {tree.latitude}, {tree.longitude}</p>
      </div>

      <Comments treeId={tree.id} />
    </div>
  );
}
