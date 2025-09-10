// src/components/ImageGrid.jsx
import React, { useState } from "react";
import ImageModal from "./ImageModal";

export default function ImageGrid({ images = [], onClick }) {
  const [open, setOpen] = useState(null);

  if (!images.length) return <div className="text-[var(--muted)] p-4">No images yet.</div>;
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3">
        {images.map((img) => (
          <div
            key={img.id || img.image_id || img.url}
            className="bg-[var(--card)] rounded overflow-hidden shadow hover:scale-105 transition-transform duration-150"
          >
            <img
              src={img.thumbnail || img.url}
              alt={img.title || "image"}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => setOpen(img)}
            />
            <div className="p-2">
              <div className="text-sm font-medium">{img.title || img.filename || "Untitled"}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-[var(--muted)]">{img.likes || 0} ♥</div>
                <div className="text-xs text-[var(--muted)]">{img.uploaded_at ? new Date(img.uploaded_at).toLocaleDateString() : ""}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && <ImageModal item={open} onClose={() => setOpen(null)} />}
    </>
  );
}
