// src/components/LoginForm.jsx
import { useState, useContext } from "react";
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
        await register({ 
          name: form.name, 
          email: form.email, 
          password: form.password 
        });
      }
      onSuccess?.();
    } catch (e) {
      setError(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null); // Clear error when switching modes
  };

  return (
    <div className="max-w-md mx-auto bg-[var(--card)] p-6 rounded shadow">
      <h2 className="text-xl mb-4 font-semibold">
        {mode === "login" ? "Login" : "Create Account"}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <input 
            required 
            placeholder="Full Name" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full p-3 rounded bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]"
          />
        )}
        <input 
          required 
          placeholder="Email" 
          type="email" 
          value={form.email} 
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="w-full p-3 rounded bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]"
        />

        <div className="relative">
          <input 
            required 
            placeholder="Password" 
            type={show ? "text" : "password"} 
            value={form.password} 
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full p-3 rounded bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] pr-12"
            minLength={6}
          />
          <button 
            type="button" 
            onClick={() => setShow(s => !s)} 
            className="absolute right-3 top-3 text-sm text-[var(--muted)] hover:text-[var(--text)]"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded bg-red-100 text-red-700 border border-red-300">
            {error}
          </div>
        )}
        
        <div className="flex gap-3 pt-2">
          <button 
            disabled={loading} 
            className="flex-1 bg-[var(--primary)] px-4 py-3 rounded text-white font-medium hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            {loading ? "Processing..." : (mode === "login" ? "Login" : "Register")}
          </button>
          <button 
            type="button" 
            onClick={switchMode}
            className="px-4 py-3 rounded border border-[var(--border)] hover:bg-[var(--bg-muted)]"
          >
            {mode === "login" ? "Sign Up" : "Back to Login"}
          </button>
        </div>
      </form>
    </div>
  );
}