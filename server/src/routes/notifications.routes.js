// notifications.routes.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notifications.controllers.js";

const router = Router();

router.post("/create", authenticateToken, createNotification);
router.get("/user/:userId", authenticateToken, getUserNotifications);
router.patch("/:notifyId/read", authenticateToken, markAsRead);
router.patch("/user/:userId/read-all", authenticateToken, markAllAsRead);
router.delete("/:notifyId", authenticateToken, deleteNotification);

export default router;
