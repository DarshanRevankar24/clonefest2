// src/components/ImageGrid.jsx
import { useState } from "react";
import ImageModal from "./ImageModal";

export default function ImageGrid({ images = [], onClick }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images.length) {
    return (
      <div className="text-[var(--muted)] p-8 text-center bg-[var(--bg-muted)] rounded-lg">
        <div className="text-lg mb-2">No images found</div>
        <div className="text-sm">Upload some images to get started</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-3">
        {images.map((img) => (
          <div
            key={img.id || img.image_id || img.url}
            className="bg-[var(--card)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 hover:scale-[1.02] transition-transform duration-200"
          >
            <img
              src={img.thumbnail || img.url || img.image_url}
              alt={img.title || img.filename || "Uploaded image"}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => {
                setSelectedImage(img);
                onClick?.(img); // Propagate click event if needed
              }}
              loading="lazy" // Lazy load images for better performance
              onError={(e) => {
                // Fallback for broken images
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM4YzhmOTAiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=";
              }}
            />
            <div className="p-3">
              <div className="text-sm font-medium truncate" title={img.title || img.filename}>
                {img.title || img.filename || "Untitled"}
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-[var(--muted)] flex items-center gap-1">
                  <span>♥</span>
                  {img.likes_count || img.likes || 0}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {img.created_at || img.uploaded_at 
                    ? new Date(img.created_at || img.uploaded_at).toLocaleDateString()
                    : ""
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal 
          item={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </>
  );
}