// src/components/LoginForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginForm({ onSuccess }) {
  const { login, register } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
      }
      onSuccess?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[var(--card)] p-6 rounded shadow">
      <h2 className="text-xl mb-4">{mode === "login" ? "Login" : "Register"}</h2>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input required placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full p-3 rounded bg-[var(--bg)] text-[var(--text)]" />
        )}
        <input required placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}
          className="w-full p-3 rounded bg-[var(--bg)] text-[var(--text)]" />

        <div className="relative">
          <input required placeholder="Password" type={show ? "text" : "password"} value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}
            className="w-full p-3 rounded bg-[var(--bg)] text-[var(--text)]" />
          <button type="button" onClick={()=>setShow(s=>!s)} className="absolute right-3 top-3 text-sm">
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-3">
          <button disabled={loading} className="bg-[var(--primary)] px-4 py-2 rounded text-white">
            {loading ? "..." : (mode === "login" ? "Login" : "Register")}
          </button>
          <button type="button" onClick={()=>setMode(mode==="login"?"register":"login")} className="px-4 py-2 rounded border">
            {mode === "login" ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
