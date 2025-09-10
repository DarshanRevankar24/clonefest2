import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-[var(--card)] text-[var(--text)] p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">CloneFest Gallery</Link>
        <NavLink to="/gallery" className="text-sm">Gallery</NavLink>
        <NavLink to="/generate" className="text-sm">Generate</NavLink>
        <NavLink to="/vector" className="text-sm">Vector Search</NavLink>
        <NavLink to="/palette" className="text-sm">Palettes</NavLink>
      </div>
      <div className="flex items-center gap-4">
        <NavLink to="/search" className="text-sm">Search</NavLink>
        {user ? (
          <>
            <span className="text-sm">Hi, {user.name || user.email}</span>
            <button onClick={logout} className="bg-[var(--primary)] px-3 py-1 rounded text-white text-sm">Logout</button>
            <NavLink to="/admin" className="text-sm">Admin</NavLink>
          </>
        ) : (
          <NavLink to="/login" className="bg-[var(--primary)] px-3 py-1 rounded text-white text-sm">Login</NavLink>
        )}
      </div>
    </nav>
  );
}
