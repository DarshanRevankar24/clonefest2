import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import AlbumCard from "../components/AlbumCard";
import UploadButton from "../components/UploadButton";
import toast from "react-hot-toast";

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadAlbum = async () => {
    try {
      setLoading(true);
      const data = await api.getAlbum(id);
      setAlbum(data);
    } catch (e) {
      toast.error("Failed to load album");
      console.error("Album load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbum();
  }, [id]);

  const addFilesToAlbum = async (files) => {
    try {
      setUploading(true);
      
      // Create FormData for upload
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      
      // Upload images - check if your backend supports album_id in upload
      // If so, you can add: formData.append("album_id", id);
      const uploadResponse = await api.uploadImages(formData);
      
      // Get uploaded image IDs
      const uploadedImages = uploadResponse.items || uploadResponse.images || uploadResponse;
      const imageIds = uploadedImages.map(img => img.id || img.image_id);
      
      if (imageIds.length > 0) {
        // Add images to album
        await api.addImageToAlbum(id, { image_ids: imageIds });
        toast.success(`Added ${imageIds.length} image(s) to album`);
        await loadAlbum(); // Reload album data
      }
      
    } catch (e) {
      toast.error(e.message || "Failed to add images to album");
      console.error("Add to album error:", e);
    } finally {
      setUploading(false);
    }
  };

  const removeImageFromAlbum = async (imageId) => {
    try {
      await api.removeImageFromAlbum(id, imageId);
      toast.success("Image removed from album");
      await loadAlbum(); // Reload album data
    } catch (e) {
      toast.error(e.message || "Failed to remove image");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
        <p className="mt-4 text-[var(--muted)]">Loading album...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold mb-2">Album Not Found</h3>
        <p className="text-[var(--muted)]">The album you're looking for doesn't exist</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold">{album.title}</h2>
          {album.description && (
            <p className="text-[var(--muted)] mt-2">{album.description}</p>
          )}
        </div>
        <UploadButton onFiles={addFilesToAlbum} />
      </div>

      {uploading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded border border-blue-300">
          Adding images to album...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <AlbumCard 
              album={{
                ...album,
                count: album.images?.length || 0,
                cover_image: album.cover_image || (album.images?.[0]?.url)
              }} 
            />
            <div className="mt-4 p-4 bg-[var(--card)] rounded-lg">
              <h4 className="font-semibold mb-2">Album Info</h4>
              <p className="text-sm text-[var(--muted)]">
                {album.images?.length || 0} image(s)
                <br />
                Created: {album.created_at ? new Date(album.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {album.images?.length > 0 ? (
            <ImageGrid 
              images={album.images} 
              onClick={(image) => {
                // Optional: Add image modal or actions
                console.log("Image clicked:", image);
              }}
            />
          ) : (
            <div className="text-center py-16 bg-[var(--bg-muted)] rounded-lg">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-semibold mb-2">Empty Album</h3>
              <p className="text-[var(--muted)] mb-4">This album doesn't have any images yet</p>
              <p className="text-sm text-[var(--muted)]">Upload images using the button above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}