import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const lightVars = {
  "--bg": "#ffffff",
  "--card": "#f3f4f6",
  "--text": "#111111",
  "--muted": "#6b7280",
  "--primary": "#3b82f6",
  "--accent": "#06b6d4",
};

const darkVars = {
  "--bg": "#0f172a",
  "--card": "#0b1220",
  "--text": "#e6eef8",
  "--muted": "#9aa6bd",
  "--primary": "#6366f1",
  "--accent": "#06b6d4",
};

export const ThemeProvider = ({ children }) => {
  const [vars, setVars] = useState(() => {
    const saved = localStorage.getItem("cf_palette");
    return saved ? JSON.parse(saved) : darkVars;
  });

  useEffect(() => {
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    localStorage.setItem("cf_palette", JSON.stringify(vars));
  }, [vars]);

  const toggleTheme = () => {
    setVars((prev) =>
      prev["--bg"] === "#ffffff" ? darkVars : lightVars
    );
  };

  const updateVar = (key, value) => setVars((s) => ({ ...s, [key]: value }));
  const reset = () => setVars(darkVars);

  return (
    <ThemeContext.Provider value={{ vars, updateVar, reset, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
