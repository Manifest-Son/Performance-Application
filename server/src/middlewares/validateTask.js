// middleware/validateTask.js
import { body, param } from "express-validator";

const isNotPastDate = (value) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(value);
  return inputDate >= today;
};

export const validateCreateTask = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Valid start date is required")
    .custom(isNotPastDate)
    .withMessage("Start date cannot be in the past"),
  body("completionDate")
    .isISO8601()
    .withMessage("Valid completion date is required"),
];

export const validateTaskId = [
  param("taskId").isUUID().withMessage("Invalid task ID format"),
];
