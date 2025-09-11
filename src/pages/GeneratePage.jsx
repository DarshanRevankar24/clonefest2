// src/pages/GeneratePage.jsx
import { useState, useEffect } from "react";
import api from "../api";
import GeneratedImageCard from "../components/GeneratedImageCard";
import toast from "react-hot-toast";

const SUGGESTIONS = [
  "Indian flag waving in the wind",
  "Cute puppy lying on a cozy bed",
  "Futuristic cyberpunk city at night with neon lights",
  "Sunset over lavender fields in Provence, France",
  "Ancient temple in a misty jungle",
  "Astronaut riding a horse on Mars",
  "Steampunk mechanical owl with glowing eyes",
  "Underwater castle with coral and tropical fish"
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeJobs, setActiveJobs] = useState(new Set());

  // Poll for job statuses
  useEffect(() => {
    const pollJobs = async () => {
      if (activeJobs.size === 0) return;

      for (const jobId of activeJobs) {
        try {
          const job = await api.getGenerateStatus(jobId);
          
          if (job.status === 'completed' && job.result_url) {
            // Job completed successfully
            setResults(prev => [{ url: job.result_url, prompt: job.prompt || prompt, jobId, model: job.model }, ...prev]);
            setActiveJobs(prev => {
              const newSet = new Set(prev);
              newSet.delete(jobId);
              return newSet;
            });
            toast.success("Image generated!");
          } 
          else if (job.status === 'failed') {
            // Job failed
            toast.error(job.error || "Generation failed");
            setActiveJobs(prev => {
              const newSet = new Set(prev);
              newSet.delete(jobId);
              return newSet;
            });
          }
          // If still processing, it will be checked in the next poll
        } catch (e) {
          console.error(`Polling error for job ${jobId}:`, e);
        }
      }
    };

    const interval = setInterval(pollJobs, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [activeJobs, prompt]);

  const submit = async (e) => {
    e?.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return toast.error("Please enter a prompt");

    try {
      setLoading(true);
      const res = await api.generateImage({ prompt: trimmedPrompt });
      
      // Handle different response formats
      if (res.job_id) {
        // Async job - add to active jobs for polling
        setActiveJobs(prev => new Set(prev).add(res.job_id));
        toast.loading("Image generation started...", { id: res.job_id });
      } 
      else if (res.url) {
        // Immediate result
        setResults(prev => [{ url: res.url, prompt: trimmedPrompt, model: res.model }, ...prev]);
        toast.success("Image generated!");
      }
      else if (res.items) {
        // Batch results
        const newItems = res.items.map(item => ({
          url: item.url,
          prompt: item.prompt || trimmedPrompt,
          model: item.model
        }));
        setResults(prev => newItems.concat(prev));
        toast.success(`Generated ${newItems.length} images!`);
      }
      else {
        throw new Error("Unexpected response format");
      }

      setPrompt(""); // Clear prompt after successful submission

    } catch (e) {
      toast.error(e.message || "Generation failed");
      console.error("Generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = activeJobs.size;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">AI Image Generation</h2>

      <div className="max-w-3xl mx-auto bg-[var(--card)] p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe your image (e.g. 'A serene lake at dawn with mountains')"
            className="flex-1 p-3 rounded bg-[var(--bg)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none"
            disabled={loading}
          />
          <button 
            disabled={loading || !prompt.trim()} 
            className="px-6 py-3 rounded bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </span>
            ) : "Generate"}
          </button>
        </form>

        <div className="text-sm text-[var(--muted)] mb-3">Quick prompts:</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setPrompt(s)} 
              className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--bg-muted)] text-sm transition-colors"
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg border border-blue-300">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing {pendingCount} image{pendingCount !== 1 ? 's' : ''}...</span>
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((result, index) => (
            <GeneratedImageCard key={result.jobId || result.url || index} item={result} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[var(--bg-muted)] rounded-lg">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Create Something Amazing</h3>
          <p className="text-[var(--muted)]">Enter a prompt to generate your first AI image</p>
        </div>
      )}
    </div>
  );
}