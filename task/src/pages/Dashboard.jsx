import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/client";
import "./Dashboard.css"; // Import the CSS

export default function Dashboard() {
  const { username, role: rawRole, accessToken } = useAuth();
  const role = (rawRole || "").toUpperCase();

  const [assigned, setAssigned] = useState([]);
  const [created, setCreated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const toArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const load = async () => {
    if (!accessToken) return;
    setLoading(true);
    setErr("");
    try {
      const a = await api.get("/api/tasks/assigned");
      setAssigned(toArray(a.data));

      if (role === "MANAGER") {
        const c = await api.get("/api/tasks/created");
        setCreated(toArray(c.data));
      } else {
        setCreated([]);
      }
    } catch (e) {
      console.error("Dashboard load error:", e?.response?.status, e?.response?.data, e?.message);
      setErr(e?.response?.data?.message || e?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, role]);

  // Helper to render a single task card
  const renderTaskCard = (task, isCreatedList = false) => (
    <div key={task.id || Math.random()} className="task-card">
      <h4 className="task-title">{task.title || "(No Title)"}</h4>
      
      <div className="task-meta">
        {isCreatedList ? (
          /* For managers seeing created tasks */
          <>
            <span>Assignee:</span>
            <strong>{task.assignee?.username || task.assigneeUsername || "Unassigned"}</strong>
          </>
        ) : (
          /* For users seeing their assigned tasks */
          <>
            <span>Status:</span>
            <span className="status-badge">{task.status || "OPEN"}</span>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="user-welcome">
          {username} <span style={{ opacity: 0.7 }}>| {role || "USER"}</span>
        </div>
      </header>

      {err && <div className="error-message">{err}</div>}

      {/* Assigned Tasks Section */}
      <section>
        <h3 className="section-title">My Assigned Tasks</h3>
        {loading && !assigned.length && <div className="loading-text">Loading tasks...</div>}
        
        {!loading && assigned.length === 0 ? (
          <div className="empty-state">You have no tasks assigned.</div>
        ) : (
          <div className="task-grid">
            {assigned.map((t) => renderTaskCard(t, false))}
          </div>
        )}
      </section>

      {/* Manager Section: Created Tasks */}
      {role === "MANAGER" && (
        <section>
          <h3 className="section-title">Tasks I Created</h3>
          {!loading && created.length === 0 ? (
            <div className="empty-state">You haven't created any tasks yet.</div>
          ) : (
            <div className="task-grid">
              {created.map((t) => renderTaskCard(t, true))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}