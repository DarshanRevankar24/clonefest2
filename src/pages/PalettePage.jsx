// src/pages/PalettePage.jsx
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import PaletteEditor from "../components/PaletteEditor";
import api from "../api";
import toast from "react-hot-toast";

export default function PalettePage() {
  const { applyPalette } = useContext(ThemeContext);
  const [palettes, setPalettes] = useState([]);

  const load = async () => {
    try {
      const data = await api.listPalettes();
      // Normalize: backend may return { items: [...] } or just [...]
      const arr = Array.isArray(data) ? data : data.items || [];
      setPalettes(arr);
    } catch (e) {
      console.warn(e);
      toast.error(e.message || "Failed to load palettes");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleExport = (p) => {
    navigator.clipboard.writeText(JSON.stringify(p, null, 2));
    toast.success("Palette copied to clipboard!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Palettes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Left side: palette editor */}
        <div>
          <PaletteEditor onSaved={load} />
        </div>

        {/* Right side: saved palettes */}
        <div>
          <h3 className="mb-2 font-semibold">Saved Palettes</h3>
          <div className="space-y-2">
            {palettes.length ? (
              palettes.map((p) => (
                <div
                  key={p.id}
                  className="p-3 bg-[var(--card)] rounded flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <div className="font-semibold">{p.name || "Untitled"}</div>
                    {p.description && (
                      <div className="text-xs text-[var(--muted)]">
                        {p.description}
                      </div>
                    )}
                    {Array.isArray(p.colors) && p.colors.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {p.colors.map((c, i) => (
                          <div
                            key={i}
                            title={c}
                            style={{ background: c }}
                            className="w-5 h-5 rounded border cursor-pointer"
                            onClick={() => {
                              navigator.clipboard.writeText(c);
                              toast.success(`${c} copied`);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 border rounded text-xs hover:bg-[var(--muted-bg)]"
                      onClick={() => applyPalette(p.colors || [])}
                    >
                      Apply
                    </button>
                    <button
                      className="px-2 py-1 border rounded text-xs hover:bg-[var(--muted-bg)]"
                      onClick={() => handleExport(p)}
                    >
                      Export
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[var(--muted)]">
                No saved palettes yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
