import { useState } from "react";

export default function SearchBar({ onSearch, initialQuery = "", initialAlbum = "", placeholder = "Search images, tags, captions...", className = "" }) {
  const [q, setQ] = useState(initialQuery);
  const [album, setAlbum] = useState(initialAlbum);

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q: q.trim(), album: album.trim() });
  };

  const clearSearch = () => {
    setQ("");
    setAlbum("");
    onSearch({ q: "", album: "" });
  };

  const hasSearch = q.trim() || album.trim();

  return (
    <form onSubmit={submit} className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center ${className}`}>
      <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
        <input 
          placeholder={placeholder}
          value={q}
          onChange={e => setQ(e.target.value)}
          className="p-3 rounded bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none flex-1"
          aria-label="Search query"
        />
        
        <input 
          placeholder="Album (optional)"
          value={album}
          onChange={e => setAlbum(e.target.value)}
          className="p-3 rounded bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none w-full sm:w-44"
          aria-label="Album filter"
          list="album-suggestions"
        />
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button 
          type="submit" 
          className="px-4 py-3 bg-[var(--primary)] rounded text-white hover:bg-[var(--primary-dark)] transition-colors flex-1 sm:flex-none"
          disabled={!q.trim() && !album.trim()}
        >
          Search
        </button>
        
        {hasSearch && (
          <button 
            type="button" 
            onClick={clearSearch}
            className="px-4 py-3 bg-[var(--muted)] rounded text-white hover:bg-[var(--danger)] transition-colors"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* Optional: Add datalist for album suggestions if your API provides them */}
      <datalist id="album-suggestions">
        {/* Album suggestions would be dynamically populated */}
      </datalist>
    </form>
  );
}