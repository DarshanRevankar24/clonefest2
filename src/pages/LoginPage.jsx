import React from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <LoginForm onSuccess={() => nav("/")} />
    </div>
  );
}
