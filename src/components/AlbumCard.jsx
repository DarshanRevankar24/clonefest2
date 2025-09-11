import { Link } from "react-router-dom";

export default function AlbumCard({ album, showDescription = false, className = "" }) {
  const imageCount = album.count || album.images_count || album.images?.length || 0;
  const coverImage = album.cover_image || album.thumbnail || (album.images?.[0]?.thumbnail || album.images?.[0]?.url);

  return (
    <Link 
      to={`/album/${album.id}`} 
      className={`block bg-[var(--card)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 hover:scale-[1.02] transition-transform duration-200 ${className}`}
    >
      {coverImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={coverImage} 
            alt={album.title} 
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate" title={album.title}>
          {album.title}
        </h3>
        
        {showDescription && album.description && (
          <p className="text-sm text-[var(--muted)] mt-2 line-clamp-2" title={album.description}>
            {album.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
          <span className="text-sm text-[var(--muted)]">
            {imageCount} image{imageCount !== 1 ? 's' : ''}
          </span>
          
          {album.created_at && (
            <span className="text-xs text-[var(--muted)]">
              {new Date(album.created_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}