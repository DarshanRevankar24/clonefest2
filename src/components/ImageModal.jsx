// src/components/ImageModal.jsx
import { useState, useContext } from "react";
import toast from "react-hot-toast";
import ColorThief from "color-thief-browser";
import { ThemeContext } from "../contexts/ThemeContext";

const rgbToHex = (rgb) =>
  "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");

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

      await img.decode(); // wait for image to load

      const ct = new ColorThief();
      const pal = ct.getPalette(img, 6);
      const hex = pal.map(rgbToHex);

      setPalette(hex);
      toast.success("Palette extracted");
    } catch (e) {
      toast.error("Could not extract palette (CORS or invalid image).");
      console.error("Palette extraction error:", e);
    } finally {
      setLoading(false);
    }
  };

  const apply = () => {
    if (!palette) return toast("Extract a palette first");
    applyPalette(palette);
    toast.success("Applied palette to theme");
  };

  const safeCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Clipboard not available");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-[var(--card)] rounded p-4 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-semibold">{item.title || "Image"}</h3>
          <div className="flex gap-2">
            <a
              href={item.url || item.thumbnail}
              download
              className="px-3 py-1 rounded border"
            >
              Download
            </a>
            <button onClick={onClose} className="px-3 py-1 rounded border">
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 md:flex gap-4">
          {/* Image preview */}
          <div className="md:flex-1">
            <img
              src={item.url || item.thumbnail}
              className="w-full h-96 object-contain rounded"
              alt={item.title || "Selected image"}
            />
          </div>

          {/* Palette tools */}
          <div className="w-64">
            <div className="mb-3 text-[var(--muted)]">
              {item.description || "No description"}
            </div>

            <button
              onClick={extractPalette}
              disabled={loading}
              className="w-full px-3 py-2 rounded bg-[var(--primary)] text-white mb-2"
            >
              {loading ? "Extracting…" : "Extract Palette"}
            </button>

            {palette && (
              <div className="mb-3">
                {/* Color swatches */}
                <div className="flex gap-2 flex-wrap">
                  {palette.map((c, i) => (
                    <div
                      key={i}
                      title={c}
                      className="w-12 h-12 rounded border cursor-pointer"
                      onClick={() => safeCopy(c, c)}
                      style={{ background: c }}
                    />
                  ))}
                </div>

                {/* Palette actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={apply}
                    className="px-3 py-2 rounded bg-[var(--accent)] text-white"
                  >
                    Apply Palette
                  </button>
                  <button
                    onClick={() =>
                      safeCopy(JSON.stringify(palette), "Palette JSON")
                    }
                    className="px-3 py-2 rounded border"
                  >
                    Copy JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
