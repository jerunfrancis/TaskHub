import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./auth/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";

function Protected({ children, role }) {
  const { accessToken, role: myRole } = useAuth();
  if (!accessToken) return <Navigate to="/login" replace />;
  if (role && myRole !== role) return <div style={{ padding: 20 }}>Not authorized</div>;
  return children;
}

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>TaskHub</h1>
      <nav style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">My Tasks</Link>
        <Link to="/manage">Manage</Link>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/tasks"
            element={
              <Protected>
                <Tasks />
              </Protected>
            }
          />
          <Route
            path="/manage"
            element={
              <Protected role="MANAGER">
                <Tasks manage />
              </Protected>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
