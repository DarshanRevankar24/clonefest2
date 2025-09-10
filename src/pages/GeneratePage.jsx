// src/pages/GeneratePage.jsx
import React, { useState } from "react";
import api from "../api";
import GeneratedImageCard from "../components/GeneratedImageCard";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "Indian flag",
  "Cute puppy lying on bed",
  "Futuristic cyberpunk city at night",
  "Sunset over lavender fields",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const submit = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) return toast.error("Add a prompt");
    try {
      setLoading(true);
      const res = await api.generateImage({ prompt });
      // handle response shapes
      const items = [];
      if (res.job_id) {
        const job = await api.getGenerateStatus(res.job_id);
        if (job?.result_url) items.push({ url: job.result_url, prompt });
      } else if (res.url) items.push({ url: res.url, prompt });
      else if (res.items) items.push(...res.items.map(it => ({ url: it.url, prompt: it.prompt || prompt, model: it.model })));
      // push to results (attach prompt)
      setResults(prev => items.concat(prev));
      toast.success("Generated");
    } catch (e) {
      toast.error(e.message || "Generation failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-4">AI Image Generation</h2>

      <div className="max-w-3xl mx-auto bg-[var(--card)] p-6 rounded-lg shadow">
        <form onSubmit={submit} className="flex gap-3">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your image (e.g. 'A serene lake at dawn')"
            className="flex-1 p-3 rounded bg-[var(--bg)] border border-transparent focus:outline-none"
          />
          <button disabled={loading} className="px-4 py-2 rounded bg-[var(--primary)] text-white">
            {loading ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"></span>Generating...</span> : "Generate"}
          </button>
        </form>

        <div className="mt-3 text-sm text-[var(--muted)]">Quick prompts:</div>
        <div className="mt-2 flex gap-2 flex-wrap">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => setPrompt(s)} className="px-3 py-1 rounded border text-sm">{s}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((r, i) => <GeneratedImageCard key={i} item={r} />)}
      </div>
    </div>
  );
}
