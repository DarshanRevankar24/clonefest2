import React, { useEffect, useState } from "react";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import UploadButton from "../components/UploadButton";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const data = await api.listImages({ limit: 50 });
      setImages(data.items || data || []);
    } catch (e) {
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
        // simple progress logging
        console.log("uploaded", Math.round((ev.loaded / ev.total) * 100));
      });
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Gallery</h2>
        <UploadButton onFiles={onFiles} />
      </div>

      {uploading && <div className="mb-2 text-[var(--muted)]">Uploading...</div>}
      <ImageGrid images={images} />
    </div>
  );
}
