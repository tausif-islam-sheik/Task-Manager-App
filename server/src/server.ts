import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./app/config/env";
import taskRouter from "./app/routes/task.routes";

const app: Application = express();

// --- Middleware ---

// Enable CORS for the frontend running on localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// --- Routes ---

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

// Task REST API Router
app.use("/api/tasks", taskRouter);

// --- Start the Server ---
app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
