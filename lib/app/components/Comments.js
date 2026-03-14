"use client"
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Comments({ treeId, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetch();
  }, [treeId]);

  async function fetch() {
    const { data } = await supabase.from('tree_comments').select('*').eq('tree_id', treeId);
    setComments(data || []);
  }

  async function submit(e) {
    e.preventDefault();
    if (!text || !user) return;
    await supabase.from('tree_comments').insert([{ tree_id: treeId, user_id: user.id, content: text }]);
    setText('');
    fetch();
  }

  return (
    <div className="mt-8">
      <h3 className="font-bold mb-4">Comments</h3>
      <div className="space-y-4 mb-4">
        {comments.map(c => (
          <div key={c.id} className="bg-gray-50 p-3 rounded-lg text-sm">{c.content}</div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Add a note..." />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Post</button>
      </form>
    </div>
  );
}
