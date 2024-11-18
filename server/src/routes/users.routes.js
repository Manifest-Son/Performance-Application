import { Router } from "express";
import {
  signupUser,
  loginUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
} from "../controllers/users.controllers.js";
import { authenticateToken } from "../middlewares/auth.js";
import {
  validateSignup,
  validateLogin,
  validateUserId,
  validateUpdateUser,
} from "../middlewares/users.middlewares.js";
import { validationResult } from "express-validator";

const router = Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json("An error has occured.");
  }
  next();
};

router.post("/signup", validateSignup, handleValidationErrors, signupUser);
router.post("/login", validateLogin, handleValidationErrors, loginUser);
router.delete(
  "/:userId",
  // authenticateToken,
  // validateUserId,
  // handleValidationErrors,
  deleteUser,
);
router.patch(
  "/:userId",
  // authenticateToken,
  validateUpdateUser,
  handleValidationErrors,
  updateUser,
);
router.get("/", getAllUsers);
router.get(
  "/:userId",
  // authenticateToken,
  validateUserId,
  handleValidationErrors,
  getUserById,
);

export default router;
