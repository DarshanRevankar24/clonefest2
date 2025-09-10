import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const defaultVars = {
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
    return saved ? JSON.parse(saved) : defaultVars;
  });

  useEffect(() => {
    Object.entries(vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    localStorage.setItem("cf_palette", JSON.stringify(vars));
  }, [vars]);

  const updateVar = (key, value) => setVars((s) => ({ ...s, [key]: value }));
  const reset = () => {
    setVars(defaultVars);
  };

  return (
    <ThemeContext.Provider value={{ vars, updateVar, reset }}>
      {children}
    </ThemeContext.Provider>
  );
};
