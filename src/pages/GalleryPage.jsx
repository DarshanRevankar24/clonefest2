// src/pages/GalleryPage.jsx
import { useEffect, useState } from "react";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import UploadButton from "../components/UploadButton";
import toast from "react-hot-toast";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("recent");

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.listImages({ limit: 50, sort: filter });
      setImages(data.items || data.images || data || []);
    } catch (e) {
      toast.error("Could not load images");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]); // Reload when filter changes

  const onFiles = async (files) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    // OR if your backend expects "image" instead of "files":
    // files.forEach((f) => fd.append("image", f));
    
    try {
      setUploading(true);
      await api.uploadImages(fd, (ev) => {
        // Progress handling (optional)
        const percent = Math.round((ev.loaded * 100) / ev.total);
        console.log(`Upload progress: ${percent}%`);
      });
      await load(); // Reload images after upload
      toast.success("Upload successful!");
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Gallery</h2>
        <UploadButton onFiles={onFiles} />
      </div>

      <div className="mb-6 flex items-center gap-4">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
          className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]"
          disabled={loading}
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
          <option value="oldest">Oldest First</option>
        </select>
        
        {loading && (
          <div className="text-[var(--muted)]">Loading...</div>
        )}
      </div>

      {uploading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded border border-blue-300">
          Uploading images...
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted)]">Loading images...</p>
        </div>
      ) : images.length ? (
        <ImageGrid images={images} />
      ) : (
        <div className="p-12 text-center text-[var(--muted)] bg-[var(--bg-muted)] rounded-lg">
          <svg width="200" height="120" viewBox="0 0 24 24" className="mx-auto mb-4 opacity-70">
            <path fill="currentColor" d="M21 19V8a2 2 0 0 0-2-2h-3l-2-2H6a2 2 0 0 0-2 2v11"></path>
          </svg>
          <h3 className="text-xl mb-2 font-semibold">No images yet</h3>
          <p>Upload images or generate from the <strong>Generate</strong> tab</p>
        </div>
      )}
    </div>
  );
}