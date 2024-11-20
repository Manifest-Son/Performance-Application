// taskAssignment.controllers.js
import { PrismaClient } from '@prisma/client';
import { TaskScheduler } from '../ai/scheduler.js';
import {wsServer} from "../index.js"

const scheduler = new TaskScheduler();
const prisma = new PrismaClient();

// Create Task Assignment
export const createTaskAssignment = async (req, res) => {
  try {
    const { taskId, assigneeId } = req.params;
    
    // Validate task exists
    const task = await prisma.task.findUnique({
      where: { taskId }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found"
      });
    }

    // Validate assignee is a lecturer
    const lecturer = await prisma.user.findFirst({
      where: {
        userId: assigneeId,
        role: 'lecturer'
      }
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found"
      });
    }

    const assignment = await prisma.taskAssignment.create({
      data: {
        task: {
          connect: { taskId }
        },
        assignee: {
          connect: { userId: assigneeId }
        },
        status: 'pending'
      },
      include: {
        task: true,
        assignee: true
      }
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get Assignment by ID
export const getAssignment = async (req, res) => {
  try {
    const { assignId } = req.params;

    const assignment = await prisma.taskAssignment.findUnique({
      where: { assignId },
      include: {
        task: true,
        assignee: true,
        submissions: true
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "Assignment not found"
      });
    }

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update Assignment Status
export const updateAssignmentStatus = async (req, res) => {
  try {
    const { assignId } = req.params;
    const { status } = req.body;

    const assignment = await prisma.taskAssignment.update({
      where: { assignId },
      data: {
        status,
        acceptedAt: status === 'accepted' ? new Date() : null,
        rejectedAt: status === 'rejected' ? new Date() : null
      },
      include: {
        task: true,
        assignee: true
      }
    });

    res.json({
      success: true,
      data: assignment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get Lecturer's Assignments
export const getLecturerAssignments = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    const assignments = await prisma.taskAssignment.findMany({
      where: {
        assignee_id: lecturerId
      },
      include: {
        task: true,
        submissions: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// src/controllers/taskAssignment.controllers.js
export const assignTask = async (req, res) => {
  try {
    const { taskId, assigneeId } = req.params;
    
    const assignment = await prisma.taskAssignment.create({
      data: {
        taskId,
        assignee_id: assigneeId,
        status: 'pending'
      },
      include: {
        task: true,
        assignee: true
      }
    });

    // Create immediate notification
    const notification = await prisma.notification.create({
      data: {
        userId: assigneeId,
        type: 'TASK_ASSIGNMENT',
        message: `You have been assigned: ${assignment.task.title}`,
        read: false
      }
    });

    // Schedule AI-powered reminders
    await scheduler.scheduleTaskReminders(assignment);

    res.status(201).json({
      success: true,
      data: { assignment, notification }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};