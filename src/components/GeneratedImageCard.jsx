// src/components/GeneratedImageCard.jsx
import React, { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

export default function GeneratedImageCard({ item }) {
  const { applyPalette } = useContext(ThemeContext);
  const [copied, setCopied] = useState(false);

  return (
    <div className="bg-[var(--card)] rounded overflow-hidden shadow">
      <img src={item.url} alt={item.prompt} className="w-full h-44 object-cover" />
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm font-medium">{item.prompt}</div>
            <div className="text-xs text-[var(--muted)]">model: {item.model || "unknown"}</div>
          </div>
          <div className="flex flex-col gap-2">
            <a href={item.url} download className="px-2 py-1 rounded border text-xs">Download</a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.prompt || "");
                setCopied(true); toast.success("Prompt copied");
                setTimeout(()=>setCopied(false), 1200);
              }}
              className="px-2 py-1 rounded border text-xs"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {item.palette?.length ? (
          <div className="mt-3 flex gap-2">
            {item.palette.map((c, i) => (
              <div
                key={i}
                title={c}
                style={{ background: c }}
                className="w-8 h-8 rounded border cursor-pointer"
                onClick={() => { navigator.clipboard.writeText(c); toast.success(`${c} copied`); }}
              />
            ))}
            <button onClick={() => applyPalette(item.palette)} className="ml-auto px-3 py-1 rounded border">Apply</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
