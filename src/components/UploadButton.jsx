// src/components/UploadButton.jsx
import React, { useRef, useState, useCallback } from "react";

export default function UploadButton({ onFiles }) {
  const ref = useRef();
  const [previews, setPreviews] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    setPreviews(arr.map(f => ({ name: f.name, url: URL.createObjectURL(f) })));
    onFiles?.(arr);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
  }, []);

  return (
    <div>
      <div
        onDragOver={(e)=>{ e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`p-4 rounded border-2 ${dragging ? "border-dashed border-[var(--accent)]" : "border-transparent"} bg-[var(--bg)]`}
      >
        <div className="flex items-center justify-between">
          <div className="text-sm text-[var(--muted)]">Drag & drop images here or</div>
          <div className="flex gap-2">
            <input ref={ref} type="file" multiple accept="image/*" className="hidden" onChange={(e)=>handleFiles(e.target.files)} />
            <button onClick={() => ref.current.click()} className="px-4 py-2 bg-[var(--accent)] rounded text-white">Choose Images</button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {previews.map((p,i) => (
            <div key={i} className="w-full h-24 bg-[var(--card)] rounded overflow-hidden">
              <img src={p.url} alt={p.name} className="w-full h-full object-cover"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
