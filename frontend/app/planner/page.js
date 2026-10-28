"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

const EDGES = ["#f0775a", "#ffc65c", "#7fb8f0", "#e98ab0"];

export default function PlannerPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    const user = localStorage.getItem("user");
    if (user) setUserName(JSON.parse(user).name);
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await api("/api/tasks");
      setTasks(data);
    } catch (err) {
      if (err.message.includes("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;
    try {
      const newTask = await api("/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setTasks([newTask, ...tasks]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleDone(task) {
    setError("");
    try {
      const updated = await api(`/api/tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({ done: !task.done }),
      });
      setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteTask(id) {
    setError("");
    try {
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const pendingCount = tasks.length - doneCount;
  const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  const visible = tasks.filter((t) =>
    filter === "done" ? t.done : filter === "active" ? !t.done : true
  );

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "To do" },
    { key: "done", label: "Done" },
  ];

  return (
    <main className="app-bg p-4 sm:p-8">
      <div className="fade-up max-w-2xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading text-3xl sm:text-4xl">
              Hi {userName || "there"}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Here's your plan for today
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-white/70 hover:bg-white transition"
            style={{ color: "var(--ink)" }}
          >
            Log out
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: tasks.length, color: "#7fb8f0" },
            { label: "To do", value: pendingCount, color: "var(--accent)" },
            { label: "Done", value: doneCount, color: "var(--done)" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl font-extrabold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="card p-4">
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "var(--muted)" }}>Progress</span>
            <span className="font-bold" style={{ color: "var(--accent)" }}>
              {percent}%
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "#f3e7e7" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${percent}%`,
                background: "linear-gradient(90deg, #ffc65c, #f0775a)",
              }}
            />
          </div>
        </div>

        {/* Main card */}
        <div className="card p-5 space-y-4">
          {error && (
            <p className="text-sm p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
              {error}
            </p>
          )}

          <form onSubmit={addTask} className="flex gap-2">
            <input
              type="text"
              placeholder="What do you want to get done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field flex-1"
            />
            <button type="submit" className="btn">
              Add
            </button>
          </form>

          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                style={{
                  background: filter === t.key ? "var(--accent)" : "#fbeeee",
                  color: filter === t.key ? "#fff" : "var(--muted)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center py-6 text-sm" style={{ color: "var(--muted)" }}>
              Loading...
            </p>
          ) : visible.length === 0 ? (
            <p className="text-center py-8 text-sm" style={{ color: "var(--muted)" }}>
              {tasks.length === 0 ? "No tasks yet. Add your first one." : "Nothing in this tab."}
            </p>
          ) : (
            <ul className="space-y-2">
              {visible.map((task, i) => (
                <li
                  key={task._id}
                  className="fade-up flex items-center gap-3 rounded-xl px-3 py-3 transition hover:shadow-md"
                  style={{
                    background: task.done ? "#f1faf5" : "#fffafa",
                    borderLeft: `5px solid ${task.done ? "var(--done)" : EDGES[i % EDGES.length]}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleDone(task)}
                    className="h-5 w-5 cursor-pointer"
                    style={{ accentColor: "#4fb38a" }}
                  />
                  <span
                    className="flex-1 font-medium"
                    style={{
                      color: task.done ? "var(--muted)" : "var(--ink)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-sm px-2 py-1 rounded-lg transition hover:bg-red-50 hover:text-red-600"
                    style={{ color: "var(--muted)" }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}