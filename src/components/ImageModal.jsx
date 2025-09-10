// src/components/ImageModal.jsx
import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import ColorThief from "color-thief-browser";
import { ThemeContext } from "../contexts/ThemeContext";

const rgbToHex = (rgb) => "#" + rgb.map(v => v.toString(16).padStart(2, "0")).join("");

export default function ImageModal({ item, onClose }) {
  const { applyPalette } = useContext(ThemeContext);
  const [palette, setPalette] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractPalette = async () => {
    setLoading(true);
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = item.thumbnail || item.url;
      await img.decode();
      const ct = new ColorThief();
      const pal = ct.getPalette(img, 6);
      const hex = pal.map(rgbToHex);
      setPalette(hex);
      toast.success("Palette extracted");
    } catch (e) {
      toast.error("Could not extract palette (CORS?).");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!palette) return toast("Extract a palette first");
    applyPalette(palette);
    toast.success("Applied palette to theme");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative max-w-4xl w-full bg-[var(--card)] rounded p-4 shadow-lg">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-semibold">{item.title || "Image"}</h3>
          <div className="flex gap-2">
            <a href={item.url || item.thumbnail} download className="px-3 py-1 rounded border">Download</a>
            <button onClick={onClose} className="px-3 py-1 rounded border">Close</button>
          </div>
        </div>

        <div className="mt-4 md:flex gap-4">
          <div className="md:flex-1">
            <img src={item.url || item.thumbnail} className="w-full h-96 object-contain rounded" alt={item.title} />
          </div>

          <div className="w-64">
            <div className="mb-3 text-[var(--muted)]">{item.description}</div>

            <button onClick={extractPalette} disabled={loading} className="w-full px-3 py-2 rounded bg-[var(--primary)] text-white mb-2">
              {loading ? "Extracting…" : "Extract Palette"}
            </button>

            {palette && (
              <div className="mb-3">
                <div className="flex gap-2 flex-wrap">
                  {palette.map((c, i) => (
                    <div key={i} title={c} className="w-12 h-12 rounded border cursor-pointer" onClick={() => { navigator.clipboard.writeText(c); toast.success(`${c} copied`); }} style={{ background: c }} />
                  ))}
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={apply} className="px-3 py-2 rounded bg-[var(--accent)] text-white">Apply Palette</button>
                  <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(palette)); toast.success("Palette JSON copied"); }} className="px-3 py-2 rounded border">Copy JSON</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
