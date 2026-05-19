import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

import {
  addTask,
  getTaskList,
  getTaskById,
  updateTask,
  deleteTask,
  deleteMultipleTasks,
} from "../controllers/tasks/taskCrudController.js";

import {
  getTaskStats,
  getAnalytics,
} from "../controllers/tasks/taskAnalyticsController.js";

const router = express.Router();

// ALL TASK ROUTES PROTECTED
router.use(verifyToken);

// ANALYTICS
router.get("/task-stats", getTaskStats);
router.get("/analytics", getAnalytics);

// TASK CRUD
router.post("/add-task", addTask);
router.get("/task-list", getTaskList);
router.get("/task/:id", getTaskById);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.delete("/delete-multiple", deleteMultipleTasks);

export default router;
