"use client";

import { useEffect, useState } from "react";
import { getTasks, createTask, updateTaskStatus, deleteTask, Task } from "@/lib/api";
import { Plus, Trash2, CheckCircle2, Clock, Circle, FileText, Layers, RefreshCw } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">("To Do");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setError("Unable to connect to the task server. Please check that the server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });
      setTitle("");
      setDescription("");
      setStatus("To Do");
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to create task. Please ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: "To Do" | "In Progress" | "Done") {
    try {
      await updateTaskStatus(id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update task status.");
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

  // Count helper
  const getCountByStatus = (s: Task["status"]) => tasks.filter((t) => t.status === s).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-800/80 pb-8 mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg text-white shadow-md shadow-indigo-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Task Manager App
              </h1>
            </div>
            <p className="text-sm text-zinc-400 font-medium">
              Manage your project tasks dynamically with real-time feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTasks}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all text-zinc-300 hover:text-white cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Sync Board
            </button>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex gap-1 bg-zinc-900/60 border border-zinc-800/80 p-1 rounded-lg text-xs font-semibold">
              <span className="px-2 py-1 text-zinc-400">Total: {tasks.length}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (Span 4) */}
          <section className="lg:col-span-4 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-violet-600" />
            
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              New Task
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="task-title" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Task Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>

              <div>
                <label htmlFor="task-desc" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Add details, links or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
                />
              </div>

              <div>
                <label htmlFor="task-status" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task["status"])}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500/80 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                >
                  <option value="To Do" className="bg-zinc-950">To Do</option>
                  <option value="In Progress" className="bg-zinc-950">In Progress</option>
                  <option value="Done" className="bg-zinc-950">Done</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </form>
          </section>

          {/* Right Column: Board Layout (Span 8) */}
          <main className="lg:col-span-8 space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {loading && tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Fetching board states...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl p-16 text-center shadow-inner">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                  <FileText className="w-5 h-5 text-zinc-500" />
                </div>
                <h3 className="text-base font-bold text-zinc-300 mb-1">No tasks yet</h3>
                <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
                  Add one above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* 1. TO DO Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="font-bold text-sm text-zinc-200">To Do</span>
                    </div>
                    <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {getCountByStatus("To Do")}
                    </span>
                  </div>
                  
                  <div className="space-y-3 min-h-[150px]">
                    {tasks
                      .filter((t) => t.status === "To Do")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                        />
                      ))}
                    {getCountByStatus("To Do") === 0 && (
                      <div className="text-center py-8 border border-dashed border-zinc-900 rounded-xl text-zinc-600 text-xs font-semibold">
                        Empty column
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. IN PROGRESS Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-bold text-sm text-zinc-200">In Progress</span>
                    </div>
                    <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {getCountByStatus("In Progress")}
                    </span>
                  </div>

                  <div className="space-y-3 min-h-[150px]">
                    {tasks
                      .filter((t) => t.status === "In Progress")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                        />
                      ))}
                    {getCountByStatus("In Progress") === 0 && (
                      <div className="text-center py-8 border border-dashed border-zinc-900 rounded-xl text-zinc-600 text-xs font-semibold">
                        Empty column
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. DONE Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-sm text-zinc-200">Done</span>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {getCountByStatus("Done")}
                    </span>
                  </div>

                  <div className="space-y-3 min-h-[150px]">
                    {tasks
                      .filter((t) => t.status === "Done")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDelete}
                        />
                      ))}
                    {getCountByStatus("Done") === 0 && (
                      <div className="text-center py-8 border border-dashed border-zinc-900 rounded-xl text-zinc-600 text-xs font-semibold">
                        Empty column
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Date formatter helper
const formatDate = (isoString: string) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "";
  }
};

// Reusable Task Card Component
function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string, s: Task["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "To Do":
        return "bg-zinc-900 border border-zinc-800 text-zinc-400";
      case "In Progress":
        return "bg-amber-500/10 border border-amber-500/20 text-amber-400";
      case "Done":
        return "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
    }
  };

  const handleDeleteClick = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    await onDelete(task.id);
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/80 rounded-xl p-4 shadow-md hover:border-zinc-700/80 hover:shadow-lg transition-all group duration-200">
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white break-words flex-1 leading-tight">
            {task.title}
          </h3>
          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shrink-0 ${getStatusBadge(task.status)}`}>
            {task.status}
          </span>
        </div>

        {task.description ? (
          <p className="text-xs text-zinc-400 line-clamp-4 leading-relaxed break-words whitespace-pre-wrap">
            {task.description}
          </p>
        ) : null}

        {task.createdAt ? (
          <div className="text-[10px] text-zinc-500 font-medium">
            Created: {formatDate(task.createdAt)}
          </div>
        ) : null}

        <div className="pt-2.5 border-t border-zinc-800/60 flex items-center justify-between gap-3">
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
              className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg outline-none cursor-pointer transition-colors appearance-none pr-7 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%23a1a1aa%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem] bg-[right_0.5rem_center] bg-no-repeat"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
