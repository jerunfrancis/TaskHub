import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Added Link import
import api from "../api/client";
import "./Signup.css"; // Import the CSS file

export default function Signup() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, set] = useState({ username: "", password: "", role: "USER" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.post("/api/auth/signup", form);
      login(data);
      nav("/dashboard");
    } catch (e) {
      console.log("Signup error:", e.response?.status, e.response?.data, e.message);
      setErr(e.response?.data?.message || e.response?.data || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={submit} className="signup-form">
        <h2 className="signup-title">Create Account</h2>
        
        {err && <div className="error-msg">{err}</div>}
        
        <input
          className="form-input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => set((f) => ({ ...f, username: e.target.value }))}
          required
        />
        
        <input
          className="form-input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => set((f) => ({ ...f, password: e.target.value }))}
          required
        />
        
        {/* Dropdown with custom styling */}
        <select 
          className="form-select"
          value={form.role} 
          onChange={(e) => set((f) => ({ ...f, role: e.target.value }))}
        >
          <option value="USER">User</option>
          <option value="MANAGER">Manager</option>
        </select>
        
        <button type="submit" className="submit-btn">Sign Up</button>
        
        <div className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
}