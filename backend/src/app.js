import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// routes
app.use("/auth", authRoutes); // /auth/signup, /auth/login
app.use("/api", taskRoutes);  // /api/task-list, /api/add-task, etc.

export default app;