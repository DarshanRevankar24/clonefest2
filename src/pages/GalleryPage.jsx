// src/pages/GalleryPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import UploadButton from "../components/UploadButton";
import toast from "react-hot-toast";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("recent");

  const load = async () => {
    try {
      const data = await api.listImages({ limit: 50 });
      setImages(data.items || data || []);
    } catch (e) {
      toast.error("Could not load images");
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFiles = async (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    try {
      setUploading(true);
      await api.uploadImages(fd, (ev) => {
        // you can handle progress here
      });
      await load();
      toast.success("Uploaded");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl">Gallery</h2>
        <div>
          <UploadButton onFiles={onFiles} />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="p-2 rounded bg-[var(--bg)]">
          <option value="recent">Recent</option>
          <option value="favorites">Favorites</option>
        </select>
      </div>

      {uploading && <div className="mb-2 text-[var(--muted)]">Uploading...</div>}

      {images.length ? <ImageGrid images={images} /> : (
        <div className="p-12 text-center text-[var(--muted)]">
          <svg width="200" height="120" viewBox="0 0 24 24" className="mx-auto mb-4 opacity-70"><path fill="currentColor" d="M21 19V8a2 2 0 0 0-2-2h-3l-2-2H6a2 2 0 0 0-2 2v11"></path></svg>
          <h3 className="text-xl mb-1">No images yet</h3>
          <div>Upload images or generate from the <strong>Generate</strong> tab</div>
        </div>
      )}
    </div>
  );
}
