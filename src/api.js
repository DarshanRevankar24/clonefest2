// single api surface using axios and VITE_API_URL
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL + "/api",
  withCredentials: false,
  timeout: 30000, // Added timeout for better error handling
});

// attach token automatically
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("cf_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor for better error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if 401 response
      localStorage.removeItem("cf_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// helper to extract data and error handling
const handle = (p) => p.then((r) => r.data).catch((err) => {
  // normalize error
  const message = err?.response?.data?.detail || 
                 err?.response?.data?.message || 
                 err?.response?.data?.error || 
                 err.message || 
                 "API error";
  throw new Error(message);
});

export default {
  // Auth
  register: (payload) => handle(client.post("/auth/register", payload)),
  login: (payload) => handle(client.post("/auth/login", payload)),
  me: () => handle(client.get("/auth/me")),
  logout: () => {
    localStorage.removeItem("cf_token");
    return Promise.resolve();
  },

  // Images
  uploadImages: (formData, onUploadProgress) =>
    handle(client.post("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    })),
  listImages: (params) => handle(client.get("/images", { params })),
  getImage: (id) => handle(client.get(`/images/${id}`)),
  deleteImage: (id) => handle(client.delete(`/images/${id}`)),
  likeImage: (id) => handle(client.post(`/images/${id}/like`)),
  unlikeImage: (id) => handle(client.delete(`/images/${id}/like`)),
  commentImage: (id, payload) => handle(client.post(`/images/${id}/comments`, payload)),
  getImageComments: (id) => handle(client.get(`/images/${id}/comments`)),

  // Albums
  listAlbums: () => handle(client.get("/albums")),
  getAlbum: (id) => handle(client.get(`/albums/${id}`)),
  createAlbum: (payload) => handle(client.post("/albums", payload)),
  updateAlbum: (id, payload) => handle(client.put(`/albums/${id}`, payload)),
  deleteAlbum: (id) => handle(client.delete(`/albums/${id}`)),
  addImageToAlbum: (albumId, payload) => handle(client.post(`/albums/${albumId}/images`, payload)),
  removeImageFromAlbum: (albumId, imageId) => handle(client.delete(`/albums/${albumId}/images/${imageId}`)),

  // Search
  search: (params) => handle(client.get("/search", { params })),

  // Vector search
  vectorSearch: (payload) => handle(client.post("/search/vector", payload)),

  // AI generate
  generateImage: (payload) => handle(client.post("/generate", payload)),
  getGenerateStatus: (jobId) => handle(client.get(`/generate/${jobId}`)),
  listGeneratedImages: () => handle(client.get("/generate")),

  // Palettes
  listPalettes: () => handle(client.get("/palettes")),
  getPalette: (id) => handle(client.get(`/palettes/${id}`)),
  savePalette: (payload) => handle(client.post("/palettes", payload)),
  updatePalette: (id, payload) => handle(client.put(`/palettes/${id}`, payload)),
  deletePalette: (id) => handle(client.delete(`/palettes/${id}`)),

  // Admin
  adminStats: () => handle(client.get("/admin/stats")),
  adminUsers: () => handle(client.get("/admin/users")),
  adminImages: () => handle(client.get("/admin/images")),
  
  // Utility
  healthCheck: () => handle(client.get("/health")),
};