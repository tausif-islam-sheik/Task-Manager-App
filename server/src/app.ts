import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./app/config/env.js";
import taskRouter from "./app/routes/task.routes.js";

const app: Application = express();

app.use(cors({ origin: env.APP_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running!");
});

app.use("/api/tasks", taskRouter);

export default app;
