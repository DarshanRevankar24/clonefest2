import React, { useState } from "react";
import api from "../api";
import ImageGrid from "../components/ImageGrid";

export default function VectorSearchPage() {
  const [q, setQ] = useState("");
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const submitText = async (e) => {
    e.preventDefault();
    try {
      const data = await api.vectorSearch({ text: q });
      setResults(data.items || data || []);
    } catch (e) { alert(e.message); }
  };

  const submitImage = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append("probe", file);
    try {
      const data = await api.vectorSearch(fd);
      setResults(data.items || data || []);
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl">Vector Search</h2>
      <form onSubmit={submitText} className="flex gap-2 mt-4">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by text..." className="p-2 rounded bg-[var(--bg)] w-full" />
        <button className="px-3 py-2 bg-[var(--primary)] text-white rounded">Search</button>
      </form>

      <form onSubmit={submitImage} className="mt-4 flex items-center gap-2">
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0])} />
        <button className="px-3 py-2 bg-[var(--accent)] rounded text-white">Search by Image</button>
      </form>

      <div className="mt-6">
        <ImageGrid images={results} />
      </div>
    </div>
  );
}
