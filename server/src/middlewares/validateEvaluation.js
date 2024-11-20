// middleware/validateEvaluation.js
import { body } from "express-validator";

export const validateEvaluation = [
  body("feedback").notEmpty().withMessage("Feedback is required"),
  body("rating")
    .isIn(["1", "2", "3", "4", "5"])
    .withMessage("Rating must be between 1-5"),
  body("studentId").optional().isUUID().withMessage("Invalid student ID"),
  body("lecturerId").optional().isUUID().withMessage("Invalid lecturer ID"),
];
