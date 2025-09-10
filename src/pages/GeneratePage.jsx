import React, { useState } from "react";
import api from "../api";
import GeneratedImageCard from "../components/GeneratedImageCard";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.generateImage({ prompt });
      // Many backends return job object or final image - handle both
      if (res.job_id) {
        // optimistic: poll until done (backend may not implement). We'll attempt one fetch
        const job = await api.getGenerateStatus(res.job_id);
        if (job?.result_url) setResults(prev => [{ url: job.result_url, prompt, model: job.model }, ...prev]);
      } else if (res.url) {
        setResults(prev => [{ url: res.url, prompt, model: res.model }, ...prev]);
      } else if (res.items) {
        setResults(prev => [...res.items.map(it => ({ url: it.url, prompt: it.prompt, model: it.model })), ...prev]);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl">AI Image Generation</h2>
      <form onSubmit={submit} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Describe your image..." className="p-2 rounded bg-[var(--bg)] md:col-span-2" />
        <div className="flex gap-2">
          <button disabled={loading} className="px-3 py-2 bg-[var(--primary)] text-white rounded">{loading ? "Generating..." : "Generate"}</button>
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((r,i) => <GeneratedImageCard key={i} item={r} />)}
      </div>
    </div>
  );
}
