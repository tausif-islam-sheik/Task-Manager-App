"use client";

import { useEffect, useState } from "react";
import { getTasks, createTask, updateTaskStatus, deleteTask, Task } from "@/lib/api";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">("To Do");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });
      // Clear form
      setTitle("");
      setDescription("");
      setStatus("To Do");
      // Refresh list
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to create task. Please verify backend is running.");
    }
  }

  async function handleStatusChange(id: string, newStatus: "To Do" | "In Progress" | "Done") {
    try {
      await updateTaskStatus(id, newStatus);
      // Update local state directly or fetch tasks
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  }

  // Helper for badge color class
  const getBadgeColor = (taskStatus: Task["status"]) => {
    switch (taskStatus) {
      case "To Do":
        return "bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";
      case "In Progress":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50";
      case "Done":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans dark:bg-zinc-950 dark:text-zinc-50 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Task Manager
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A simple, lightweight application to track your daily progress
          </p>
        </header>

        {/* Add Task Form */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">
            Create a New Task
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="task-title" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                required
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="task-desc" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="task-desc"
                placeholder="Enter optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="task-status" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task["status"])}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 transition-colors"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[38px] bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Task List Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Tasks
            </h2>
            {tasks.length > 0 && (
              <span className="text-xs bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-2 py-0.5 rounded-full font-medium">
                {tasks.length} total
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200/50 text-red-700 p-4 rounded-lg text-sm dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 text-sm">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                No tasks yet. Add one above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 dark:text-white break-words text-base">
                        {task.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>

                    {task.description ? (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap break-words leading-relaxed">
                        {task.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 self-end md:self-start">
                    <div className="flex items-center gap-1.5">
                      <label htmlFor={`status-select-${task.id}`} className="sr-only">
                        Change Status
                      </label>
                      <select
                        id={`status-select-${task.id}`}
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as Task["status"]
                          )
                        }
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs outline-none focus:border-zinc-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-700 transition-colors"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 hover:text-red-700 dark:border-red-950 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
