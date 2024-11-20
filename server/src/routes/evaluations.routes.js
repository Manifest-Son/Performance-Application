// routes/evaluations.routes.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import { checkRole } from "../middlewares/roleAuth.js";
import { validateEvaluation } from "../middlewares/validateEvaluation.js";
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
  getStudentEvaluations,
  getLecturerEvaluations,
} from "../controllers/evaluations.controllers.js";

const router = Router();

router.post(
  "/create",
  authenticateToken,
  createEvaluation,
);

router.get("/", authenticateToken, getAllEvaluations);

router.get("/:evaluationId", authenticateToken, getEvaluationById);

router.patch(
  "/:evaluationId",
  authenticateToken,
  checkRole("admin", "lecturer"),
  validateEvaluation,
  updateEvaluation,
);

router.delete(
  "/:evaluationId",
  authenticateToken,
  checkRole("admin"),
  deleteEvaluation,
);

router.get("/student/:studentId", authenticateToken, getStudentEvaluations);

router.get("/lecturer/:lecturerId", authenticateToken, getLecturerEvaluations);

export default router;
