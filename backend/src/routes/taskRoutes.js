import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import {
  addTask,
  getTaskList,
  getTaskById,
  updateTask,
  deleteTask,
  deleteMultipleTasks,
} from "../controllers/taskController.js";

const router = express.Router();

// verifyToken is applied to every route in this file
router.use(verifyToken);

router.post("/add-task", addTask);
router.get("/task-list", getTaskList);
router.get("/task/:id", getTaskById);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.delete("/delete-multiple", deleteMultipleTasks);

export default router;