import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import api from "../api";
import ImageGrid from "../components/ImageGrid";

export default function SearchPage() {
  const [results, setResults] = useState([]);

  const doSearch = async (params) => {
    try {
      const data = await api.search(params);
      setResults(data.items || data || []);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Search</h2>
      <SearchBar onSearch={doSearch} />
      <div className="mt-4">
        <ImageGrid images={results} />
      </div>
    </div>
  );
}
