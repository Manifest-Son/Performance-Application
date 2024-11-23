// metrics.routes.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { checkRole } from "../middlewares/roleAuth.js";
import {
  getLecturerMetrics,
  getDepartmentMetrics,
  getTrendingMetrics,
} from "../controllers/metrics.controllers.js";

const router = Router();

router.get("/lecturer/:lecturerId", authenticateToken, getLecturerMetrics);

router.get(
  "/department/:departmentId",
  authenticateToken,
  checkRole("admin"),
  getDepartmentMetrics,
);

router.get("/trending/:lecturerId", authenticateToken, getTrendingMetrics);

export default router;
