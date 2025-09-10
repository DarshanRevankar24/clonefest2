import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import PaletteEditor from "../components/PaletteEditor";
import api from "../api";

export default function PalettePage() {
  const { vars } = useContext(ThemeContext);
  const [palettes, setPalettes] = useState([]);

  const load = async () => {
    try {
      const data = await api.listPalettes();
      setPalettes(data.items || data || []);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Palettes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <PaletteEditor />
        </div>
        <div>
          <h3 className="mb-2">Saved Palettes</h3>
          <div className="space-y-2">
            {palettes.length ? palettes.map((p) => (
              <div key={p.id} className="p-3 bg-[var(--card)] rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-[var(--muted)]">{p.description}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 border rounded">Apply</button>
                  <button className="px-2 py-1 border rounded">Export</button>
                </div>
              </div>
            )) : <div className="text-[var(--muted)]">No saved palettes yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
