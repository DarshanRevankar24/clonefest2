import React, { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function PaletteEditor() {
  const { vars, updateVar, reset } = useContext(ThemeContext);
  const [name, setName] = useState("");

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(vars, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (name || "palette") + ".json";
    a.click();
  };

  return (
    <div className="bg-[var(--card)] p-4 rounded space-y-3">
      <h3 className="text-lg">Palette Editor</h3>
      {Object.entries(vars).map(([k,v]) => (
        <div key={k} className="flex items-center gap-3">
          <div className="w-48 text-sm">{k.replace("--","")}</div>
          <input value={v} onChange={(e)=>updateVar(k, e.target.value)} className="p-2 rounded bg-[var(--bg)] text-[var(--text)]" />
          <input type="color" value={v} onChange={(e)=>updateVar(k, e.target.value)} className="w-10 h-10 p-0 border-0" />
        </div>
      ))}
      <div className="flex gap-3">
        <button onClick={reset} className="px-3 py-2 rounded bg-[var(--primary)] text-white">Reset</button>
        <input placeholder="filename" value={name} onChange={(e)=>setName(e.target.value)} className="p-2 rounded bg-[var(--bg)]" />
        <button onClick={exportJSON} className="px-3 py-2 rounded border">Export</button>
      </div>
    </div>
  );
}
