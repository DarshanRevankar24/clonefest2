// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";


function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm px-3 py-1 rounded-lg transition-all duration-200
         ${isActive 
            ? "bg-blue-200 text-blue-700 shadow-md" 
            : "hover:text-blue-700 hover:scale-105"}`
      }
    >
      {children}
    </NavLink>
  );
}


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { toggleTheme, vars } = useContext(ThemeContext);
  const nav = useNavigate();

  return (
    <nav className="bg-[var(--card)] text-[var(--text)] p-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--primary)] text-white font-bold">CF</div>
            <div className="font-bold text-lg">CloneFest Gallery</div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NavItem to="/gallery">Gallery</NavItem>
            <NavItem to="/generate">Generate</NavItem>
            <NavItem to="/vector">Vector Search</NavItem>
            <NavItem to="/palette">Palettes</NavItem>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="px-3 py-1 rounded border"
          >
            {vars["--bg"] === "#ffffff" ? "🌙" : "☀️"}
          </button>

          <NavItem to="/search">Search</NavItem>


          {user ? (
            <>
              <span className="hidden md:inline text-sm">Hi, {user.name || user.email}</span>
              <button
                onClick={() => { logout(); nav("/"); }}
                className="bg-[var(--primary)] px-3 py-1 rounded text-white text-sm"
              >
                Logout
              </button>
              <NavLink to="/admin" className="text-sm hidden md:inline">Admin</NavLink>
            </>
          ) : (
            <NavLink to="/login" className="bg-[var(--primary)] px-3 py-1 rounded text-white text-sm">Login</NavLink>
          )}
        </div>
      </div>
      
    </nav>
  );
}
