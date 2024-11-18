import { body, param } from "express-validator";

export const validateSignup = [
  body("fname").isString().withMessage("First name must be a string"),
  body("lname").isString().withMessage("Last name must be a string"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateUserId = [
  param("userId").isUUID().withMessage("User ID must be a valid UUID"),
];

export const validateUpdateUser = [
  param("userId").isUUID().withMessage("User ID must be a valid UUID"),
  body("fname")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lname").optional().isString().withMessage("Last name must be a string"),
];
