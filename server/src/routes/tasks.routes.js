// tasks.routes.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  createTask, // Import the createTask function
  getAllTasks, // Import the getAllTasks function
  getTaskById, // Import the getTaskById function(gets a single task by ID)
  updateTask, // Import the updateTask function
  deleteTask, // Import the deleteTask function
  assignTask, // Import the assignTask function
  updateTaskStatus, //Import the updateTaskStatus function
  getTasksByUser, //Import the getTasksByUser function
  getTasksByDepartment, //Import the getTasksByDepartment function
  getTaskMetrics, //Import the getTaskMetrics function
} from "../controllers/tasks.controllers.js";
import { validateCreateTask } from "../middlewares/validateTask.js";

const router = Router();

// CRUD Operations
router.post("/create", authenticateToken, validateCreateTask, createTask);
router.get("/all", authenticateToken, getAllTasks);
router.get("/:taskId", authenticateToken, getTaskById);
router.patch("/:userId/:taskId", authenticateToken, updateTask);
router.delete("/:taskId", authenticateToken, deleteTask);

// Task Assignment
router.post("/:taskId/assign", authenticateToken, assignTask);

// Task Status Management
router.patch("/:taskId/status", authenticateToken, updateTaskStatus);

// Task Tracking & Filtering
router.get("/user/:userId", authenticateToken, getTasksByUser);
router.get("/department/:deptId", authenticateToken, getTasksByDepartment);
router.get("/metrics", authenticateToken, getTaskMetrics);

export default router;
