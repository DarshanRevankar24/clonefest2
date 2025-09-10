import React from "react";

export default function GeneratedImageCard({ item }) {
  return (
    <div className="bg-[var(--card)] rounded overflow-hidden">
      <img src={item.url} alt={item.prompt} className="w-full h-48 object-cover" />
      <div className="p-2">
        <div className="text-sm">{item.prompt}</div>
        <div className="text-xs text-[var(--muted)]">model: {item.model || "unknown"}</div>
      </div>
    </div>
  );
}
