import { createContext, useEffect, useState } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      setLoading(true);
      const data = await api.me();
      setUser(data);
    } catch (e) {
      setUser(null);
      // Optional: Clear invalid token
      localStorage.removeItem("cf_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      if (data?.token) {
        localStorage.setItem("cf_token", data.token);
        await loadMe();
      }
      return data;
    } catch (error) {
      throw error; // Re-throw for component error handling
    }
  };

  const register = async (payload) => {
    try {
      const data = await api.register(payload);
      if (data?.token) {
        localStorage.setItem("cf_token", data.token);
        await loadMe();
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("cf_token");
    setUser(null);
    // Optional: Call backend logout if available
    // api.logout().catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loadMe }}>
      {children}
    </AuthContext.Provider>
  );
};