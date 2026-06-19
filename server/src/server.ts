import express, { Application, Request, Response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { env } from "./app/config/env";

const app: Application = express();

// --- Middleware ---

// Enable CORS for the frontend running on localhost:5000
app.use(cors({ origin: "http://localhost:5000" }));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// --- Task Types & In-Memory Store ---

type TaskStatus = "To Do" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

const VALID_STATUSES: TaskStatus[] = ["To Do", "In Progress", "Done"];
let tasks: Task[] = [];

// --- Routes ---

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

// GET /api/tasks — Return all tasks
app.get("/api/tasks", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks — Create a new task
app.post("/api/tasks", (req: Request, res: Response): void => {
  const { title, description, status } = req.body;

  // Validation: title and status are required
  if (!title || !status) {
    res.status(400).json({ error: "Title and status are required." });
    return;
  }

  // Validation: status must be valid
  if (!VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  const newTask: Task = {
    id: uuidv4(),
    title,
    description: description || "",
    status,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id — Update a task's status only
app.patch("/api/tasks/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  // Validation: status must be valid
  if (!status || !VALID_STATUSES.includes(status)) {
    res
      .status(400)
      .json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
    return;
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  task.status = status;
  res.json(task);
});

// DELETE /api/tasks/:id — Delete a task by id
app.delete("/api/tasks/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  const deleted = tasks.splice(taskIndex, 1);
  res.json(deleted[0]);
});

// --- Start the Server ---
app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
