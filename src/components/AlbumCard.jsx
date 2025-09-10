import React from "react";
import { Link } from "react-router-dom";

export default function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album.id}`} className="block bg-[var(--card)] p-3 rounded">
      <div className="text-lg font-semibold">{album.title}</div>
      <div className="text-sm text-[var(--muted)]">{album.count || 0} images</div>
    </Link>
  );
}
