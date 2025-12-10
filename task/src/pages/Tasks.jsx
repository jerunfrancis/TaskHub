import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/client";
import "./Tasks.css"; // Import the CSS

export default function Tasks({ manage = false }) {
  const { role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, set] = useState({
    title: "",
    description: "",
    assigneeUsername: "",
    dueDate: "",
  });

  const load = () => {
    const url = manage ? "/api/tasks/created" : "/api/tasks/assigned";
    api.get(url).then((r) => setTasks(r.data)).catch(() => {});
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [manage]);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/api/tasks", form);
    set({ title: "", description: "", assigneeUsername: "", dueDate: "" });
    load();
  };

  const edit = async (t) => {
    const title = window.prompt("Title", t.title) ?? t.title;
    if (title !== t.title) {
        await api.put(`/api/tasks/${t.id}`, { ...t, title });
        load();
    }
  };

  const remove = async (id) => {
    if(window.confirm("Are you sure you want to delete this task?")) {
        await api.delete(`/api/tasks/${id}`);
        load();
    }
  };

  const complete = async (t) => {
    await api.patch(`/api/tasks/${t.id}/status`, { status: "COMPLETED" });
    load();
  };

  return (
    <div className="tasks-container">
      <h2 className="page-title">{manage ? "Manage Team Tasks" : "My Assigned Tasks"}</h2>

      {/* CREATE FORM (Only for Managers in Manage Mode) */}
      {manage && role === "MANAGER" && (
        <form onSubmit={create} className="task-creation-form">
          <h3 className="form-header">Create New Task</h3>
          <input
            className="task-input"
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => set((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <textarea
            className="task-textarea"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => set((f) => ({ ...f, description: e.target.value }))}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input
                className="task-input"
                placeholder="Assignee Username"
                value={form.assigneeUsername}
                onChange={(e) => set((f) => ({ ...f, assigneeUsername: e.target.value }))}
                required
            />
            <input
                className="task-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => set((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          <button className="create-btn">Create Task</button>
        </form>
      )}

      {/* TASK LIST */}
      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className="task-card">
            <div className="task-content">
              <h4 className="task-title">{t.title}</h4>
              <span className={`task-status ${t.status === 'COMPLETED' ? 'status-completed' : 'status-open'}`}>
                {t.status || 'OPEN'}
              </span>
              {t.description && <p style={{color:'#666', fontSize:'0.9rem', margin:'0.5rem 0'}}>{t.description}</p>}
              {manage && <div style={{fontSize:'0.85rem', color: '#888', marginTop: '0.5rem'}}>Assignee: {t.assignee?.username || t.assigneeUsername}</div>}
            </div>

            <div className="card-actions">
              <button 
                className="action-btn btn-done" 
                onClick={() => complete(t)}
                disabled={t.status === "COMPLETED"}
              >
                {t.status === "COMPLETED" ? "Completed" : "Mark Done"}
              </button>
              
              {manage && (
                <>
                  <button className="action-btn btn-edit" onClick={() => edit(t)}>Edit</button>
                  <button className="action-btn btn-delete" onClick={() => remove(t.id)}>Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      
      {!tasks.length && (
        <div style={{ textAlign: "center", color: "#888", marginTop: "2rem" }}>
            No tasks found.
        </div>
      )}
    </div>
  );
}