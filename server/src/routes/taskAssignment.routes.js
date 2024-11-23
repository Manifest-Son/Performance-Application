// taskAssignment.routes.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  createTaskAssignment,
  getAssignment,
  updateAssignmentStatus,
  getLecturerAssignments,
} from "../controllers/taskAssignment.controllers.js";

const router = Router();

router.post(
  "/task/:taskId/assign/:assigneeId",
  authenticateToken,
  createTaskAssignment,
);
router.get("/:assignId", authenticateToken, getAssignment);
router.patch("/:assignId/status", authenticateToken, updateAssignmentStatus);
router.get("/lecturer/:lecturerId", authenticateToken, getLecturerAssignments);

export default router;
