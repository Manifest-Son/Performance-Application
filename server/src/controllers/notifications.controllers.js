// notifications.controllers.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create Notification
export const createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
        read: false,
      },
      include: {
        user: true,
      },
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get All User Notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { notifyId } = req.params;

    const notification = await prisma.notification.update({
      where: { notifyId },
      data: { read: true },
    });

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Mark All as Read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notifyId } = req.params;

    await prisma.notification.delete({
      where: { notifyId },
    });

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
