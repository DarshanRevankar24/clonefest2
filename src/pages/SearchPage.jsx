import { useState } from "react";
import SearchBar from "../components/SearchBar";
import api from "../api";
import ImageGrid from "../components/ImageGrid";
import toast from "react-hot-toast";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  const doSearch = async (params) => {
    if (!params.q && !params.album) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearchParams(params);
      const data = await api.search(params);
      setResults(data.items || data.images || data || []);
      setHasSearched(true);
      
      if (data.items?.length === 0 || data.images?.length === 0 || (Array.isArray(data) && data.length === 0)) {
        toast.success("No results found for your search");
      }
    } catch (e) {
      toast.error(e.message || "Search failed");
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Search Images</h2>
        {hasSearched && (
          <button 
            onClick={clearSearch}
            className="px-4 py-2 bg-[var(--muted)] rounded text-white hover:bg-[var(--danger)] transition-colors"
          >
            Clear Search
          </button>
        )}
      </div>

      <SearchBar onSearch={doSearch} className="mb-6" />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--muted)]">Searching...</p>
        </div>
      ) : hasSearched ? (
        <div className="mt-6">
          <div className="mb-4 text-[var(--muted)]">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for{" "}
            {searchParams.q && <span className="font-semibold">"{searchParams.q}"</span>}
            {searchParams.q && searchParams.album && " in "}
            {searchParams.album && <span className="font-semibold">album: {searchParams.album}</span>}
          </div>
          <ImageGrid images={results} />
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--muted)]">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Search Your Gallery</h3>
          <p>Enter keywords or album names to find your images</p>
        </div>
      )}
    </div>
  );
}