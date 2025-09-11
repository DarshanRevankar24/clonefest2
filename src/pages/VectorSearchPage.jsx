// src/pages/VectorSearchPage.jsx
import { useState } from "react";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import toast from "react-hot-toast";

export default function VectorSearchPage() {
  const [q, setQ] = useState("");
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const submitText = async (e) => {
    e?.preventDefault();
    if (!q.trim()) return toast.error("Add query");
    try {
      const data = await api.vectorSearch({ text: q });
      setResults(data.items || data || []);
    } catch (e) {
      toast.error(e.message || "Search failed");
    }
  };

  const submitImage = async (e) => {
    e?.preventDefault();
    if (!file) return toast.error("Choose an image");
    const fd = new FormData();
    fd.append("probe", file);
    try {
      const data = await api.vectorSearch(fd);
      setResults(data.items || data || []);
    } catch (e) {
      toast.error(e.message || "Search failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl mb-4">Vector Search</h2>

      <form onSubmit={submitText} className="max-w-2xl">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by text..." className="p-3 rounded w-full bg-[var(--bg)]" />
        <div className="mt-3 flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-[var(--primary)] text-white">Search</button>
        </div>
      </form>

      <div className="mt-6 max-w-2xl">
        <form onSubmit={submitImage} className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0])} />
          <button className="px-4 py-2 bg-[var(--accent)] rounded text-white">Search by Image</button>
        </form>
      </div>

      <div className="mt-6">
        <ImageGrid images={results} />
      </div>
    </div>
  );
}
