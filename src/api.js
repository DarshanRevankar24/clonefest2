// single api surface using axios and VITE_API_URL
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL + "/api",
  withCredentials: false,
});

// attach token automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("cf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// helper to extract data and error handling
const handle = (p) => p.then((r) => r.data).catch((err) => {
  // normalize error
  const message = err?.response?.data?.detail || err.message || "API error";
  throw new Error(message);
});

export default {
  // Auth
  register: (payload) => handle(client.post("/auth/register", payload)),
  login: (payload) => handle(client.post("/auth/login", payload)),
  me: () => handle(client.get("/auth/me")),

  // Images
  uploadImages: (formData, onUploadProgress) =>
    handle(client.post("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    })),
  listImages: (params) => handle(client.get("/images", { params })),
  getImage: (id) => handle(client.get(`/images/${id}`)),
  likeImage: (id) => handle(client.post(`/images/${id}/like`)),
  commentImage: (id, payload) => handle(client.post(`/images/${id}/comments`, payload)),

  // Albums
  listAlbums: () => handle(client.get("/albums")),
  getAlbum: (id) => handle(client.get(`/albums/${id}`)),
  createAlbum: (payload) => handle(client.post("/albums", payload)),
  addImageToAlbum: (albumId, payload) => handle(client.post(`/albums/${albumId}/images`, payload)),

  // Search
  search: (params) => handle(client.get("/search", { params })),

  // Vector search
  vectorSearch: (payload) => handle(client.post("/search/vector", payload)),

  // AI generate
  generateImage: (payload) => handle(client.post("/generate", payload)),
  getGenerateStatus: (jobId) => handle(client.get(`/generate/${jobId}`)),

  // Palettes
  listPalettes: () => handle(client.get("/palettes")),
  savePalette: (payload) => handle(client.post("/palettes", payload)),

  // Admin placeholder
  adminStats: () => handle(client.get("/admin/stats")),
};
