// notifications.controllers.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Notification types
const NotificationType = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_UPDATED: 'task_updated',
  FEEDBACK_REQUEST: 'feedback_request',
  MESSAGE_RECEIVED: 'message_received'
};

// Create Task Assignment Notification
// notifications.controllers.js
export const createTaskNotification = async (req, res) => {
  try {
    const { taskId, assigneeId } = req.params;
    
    // Validate task exists
    const task = await prisma.task.findUnique({
      where: { taskId },
      include: { creator: true }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found"
      });
    }

    // Validate assignee exists
    const assignee = await prisma.user.findUnique({
      where: { userId: assigneeId }
    });

    if (!assignee) {
      return res.status(404).json({
        success: false,
        error: "Assignee not found"
      });
    }

    const notification = await prisma.notification.create({
      data: {
        userId: assigneeId,
        type: NotificationType.TASK_ASSIGNED,
        message: `New task "${task.title}" has been assigned to you`,
        read: false
      },
      include: {
        user: true
      }
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Create Feedback Request Notification
export const createFeedbackRequestNotification = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const requestedBy = req.user.userId; // Get from authenticated user

    // Validate lecturer exists
    const lecturer = await prisma.user.findFirst({
      where: {
        userId: lecturerId,
        role: 'lecturer'
      }
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found"
      });
    }

    const notification = await prisma.notification.create({
      data: {
        userId: lecturerId,
        type: NotificationType.FEEDBACK_REQUEST,
        message: `Feedback requested by ${req.user.role}`,
        read: false
      },
      include: {
        user: true
      }
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get User's Unread Notifications
export const getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { notifyId } = req.params;
    
    const notification = await prisma.notification.update({
      where: { notifyId },
      data: { read: true }
    });

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notifyId } = req.params;
    
    await prisma.notification.delete({
      where: { notifyId }
    });

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};