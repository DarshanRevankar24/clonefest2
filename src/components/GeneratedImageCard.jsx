// src/components/GeneratedImageCard.jsx
import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

export default function GeneratedImageCard({ item }) {
  const { applyPalette } = useContext(ThemeContext);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!item) return null;

  // Ensure safe values
  const imageUrl = item.url?.startsWith("http")
    ? item.url
    : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${item.url || ""}`;
  const prompt = item.prompt || "No prompt available";
  const model = item.model || "unknown";
  const palette = Array.isArray(item.palette) ? item.palette : [];

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    toast.success("Prompt copied");
    setTimeout(() => setCopiedPrompt(false), 1200);
  };

  return (
    <div className="bg-[var(--card)] rounded-lg overflow-hidden shadow hover:shadow-md transition">
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-44 object-cover"
      />
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <div className="text-sm font-medium truncate">{prompt}</div>
            <div className="text-xs text-[var(--muted)]">
              model: {model}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={imageUrl}
              download
              className="px-2 py-1 rounded border text-xs hover:bg-[var(--muted-bg)]"
            >
              Download
            </a>
            <button
              onClick={handleCopyPrompt}
              className="px-2 py-1 rounded border text-xs hover:bg-[var(--muted-bg)]"
            >
              {copiedPrompt ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {palette.length > 0 && (
          <div className="mt-3 flex gap-2 items-center">
            {palette.map((c, i) => (
              <div
                key={i}
                title={c}
                style={{ background: c }}
                className="w-8 h-8 rounded border cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(c);
                  toast.success(`${c} copied`);
                }}
              />
            ))}
            <button
              onClick={() => applyPalette(palette)}
              className="ml-auto px-3 py-1 rounded border text-xs hover:bg-[var(--muted-bg)]"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
