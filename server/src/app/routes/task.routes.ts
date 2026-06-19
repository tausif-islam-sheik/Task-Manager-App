import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// --- Types & In-Memory Store ---

type TaskStatus = "To Do" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

const VALID_STATUSES: TaskStatus[] = ["To Do", "In Progress", "Done"];
let tasks: Task[] = [];

// --- Routes ---

// GET /api/tasks — Return all tasks
router.get("/", (req: Request, res: Response) => {
  res.json(tasks);
});

// POST /api/tasks — Create a new task
router.post("/", (req: Request, res: Response): void => {
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
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id — Update a task's status only
router.patch("/:id", (req: Request, res: Response): void => {
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
router.delete("/:id", (req: Request, res: Response): void => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  const deleted = tasks.splice(taskIndex, 1);
  res.json(deleted[0]);
});

export default router;
