// notifications.routes.js
import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import {
  createTaskNotification,
  createFeedbackRequestNotification,
  getUnreadNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notifications.controllers.js';

const router = Router();

router.post('/task/:taskId/assign/:assigneeId', authenticateToken, createTaskNotification);
router.post('/feedback-request/:lecturerId', authenticateToken, createFeedbackRequestNotification);
router.get('/unread/:userId', authenticateToken, getUnreadNotifications);
router.patch('/:notifyId/read', authenticateToken, markAsRead);
router.delete('/:notifyId', authenticateToken, deleteNotification);

export default router;