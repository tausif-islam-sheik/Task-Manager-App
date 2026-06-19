# Simple Task Manager

## Project Overview
A clean, minimal, and fully functional Task Manager web application built as a monorepo. It features a Next.js frontend with Tailwind CSS and an Express.js backend API. The application enables users to create tasks, view them categorized by status, update task progression using a dropdown selector, and delete tasks dynamically.

## Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, React, Fetch API
* **Backend:** Express.js, Node.js, CORS, UUID
* **Package Manager:** pnpm

## Prerequisites
* **Node.js:** version `^20.0.0` or higher (compatible with `v20` / `v22` / `v24`)
* **pnpm:** version `^11.0.0` (or npm equivalent)

## Getting Started

### 1. Clone & Set Up the Repository
```bash
git clone <repository-url>
cd Task-Manager-App
```

### 2. Set Up & Start the Backend
Open a terminal window and run:
```bash
cd server
pnpm install
pnpm dev
```
The backend server will start on [http://localhost:5000](http://localhost:5000).

### 3. Set Up & Start the Frontend
Open a new terminal window and run:
```bash
cd client
pnpm install
pnpm dev
```
The frontend application will start on [http://localhost:3000](http://localhost:3000).

---

## API Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Returns all tasks |
| `POST` | `/api/tasks` | Creates a new task. Request body requires `title` and `status` |
| `PATCH` | `/api/tasks/:id` | Updates a task's status. Request body requires `status` |
| `DELETE` | `/api/tasks/:id` | Deletes a task by its ID |

---

## Assumptions and Notes
* **In-Memory Storage:** All task data is stored in an in-memory array on the server. Data resets to an empty list whenever the server is restarted.
* **CORS Settings:** The Express backend restricts access specifically to requests originating from `http://localhost:3000`.
