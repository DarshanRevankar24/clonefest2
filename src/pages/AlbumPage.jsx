import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import AlbumCard from "../components/AlbumCard";
import UploadButton from "../components/UploadButton";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [filesToAdd, setFilesToAdd] = useState([]);

  const load = async () => {
    try {
      const data = await api.getAlbum(id);
      setAlbum(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const addFiles = async (files) => {
    // upload images first
    const fd = new FormData();
    files.forEach(f => fd.append("files", f));
    try {
      const res = await api.uploadImages(fd);
      // assume res.items contains uploaded ids
      const ids = res.items?.map(item => item.id || item.image_id) || [];
      await api.addImageToAlbum(id, { image_ids: ids });
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  if (!album) return <div className="p-6">Loading album...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl">{album.title}</h2>
        <UploadButton onFiles={addFiles} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="mb-3 text-[var(--muted)]">{album.description}</div>
          <AlbumCard album={{...album, count: album.images?.length}} />
        </div>
        <div className="md:col-span-2">
          <ImageGrid images={album.images || []} />
        </div>
      </div>
    </div>
  );
}
