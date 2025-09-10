import React, { createContext, useEffect, useState } from "react";
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data?.token) {
      localStorage.setItem("cf_token", data.token);
      await loadMe();
    }
    return data;
  };

  const register = async (payload) => {
    const data = await api.register(payload);
    if (data?.token) {
      localStorage.setItem("cf_token", data.token);
      await loadMe();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("cf_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
