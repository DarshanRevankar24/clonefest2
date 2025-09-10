import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to CloneFest Gallery</h1>
      <p className="text-[var(--muted)] mb-6">A modern media platform prototype with uploads, AI generation, palettes and vector search.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/gallery" className="p-4 rounded bg-[var(--card)]">Open Gallery</Link>
        <Link to="/generate" className="p-4 rounded bg-[var(--card)]">AI Generate</Link>
        <Link to="/vector" className="p-4 rounded bg-[var(--card)]">Vector Search</Link>
      </div>
    </div>
  );
}
