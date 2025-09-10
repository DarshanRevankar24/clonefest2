import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import GalleryPage from "../pages/GalleryPage";
import AlbumPage from "../pages/AlbumPage";
import SearchPage from "../pages/SearchPage";
import VectorSearchPage from "../pages/VectorSearchPage";
import GeneratePage from "../pages/GeneratePage";
import PalettePage from "../pages/PalettePage";
import AdminPage from "../pages/AdminPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/album/:id" element={<AlbumPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/vector" element={<VectorSearchPage />} />
      <Route path="/generate" element={<GeneratePage />} />
      <Route path="/palette" element={<PalettePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<div className="p-6">Not found</div>} />
    </Routes>
  );
}
