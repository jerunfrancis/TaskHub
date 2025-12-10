import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/client";
import "./Login.css"; // Import the CSS file here

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, set] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/api/auth/login", form);
      login(data);
      nav("/dashboard");
    } catch (e) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={submit} className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        
        {err && <div className="error-message">{err}</div>}

        <div className="form-group">
          <input
            className="login-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => set((f) => ({ ...f, username: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="login-input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => set((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Log In
        </button>

        <div className="login-footer">
          New here? <Link to="/signup">Create account</Link>
        </div>
      </form>
    </div>
  );
}