import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  const [album, setAlbum] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch({ q, album });
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input placeholder="Search images, tags, captions..." value={q} onChange={e=>setQ(e.target.value)}
        className="p-2 rounded bg-[var(--bg)] text-[var(--text)] w-full" />
      <input placeholder="Album (optional)" value={album} onChange={e=>setAlbum(e.target.value)}
        className="p-2 rounded bg-[var(--bg)] text-[var(--text)] w-44" />
      <button className="px-3 py-2 bg-[var(--primary)] rounded text-white">Search</button>
    </form>
  );
}
