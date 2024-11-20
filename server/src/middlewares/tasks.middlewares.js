// tasks.controllers.js
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, startDate, completionDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        startDate,
        completionDate,
        status: "pending",
        creatorId: req.user.userId,
      },
    });

    logger.info(`Task created: ${task.taskId} by user: ${req.user.userId}`);
    res.status(201).json(task);
  } catch (error) {
    logger.error("Error creating task:", {
      error: error.message,
      user: req.user.userId,
    });
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/tasks/metrics:
 *   get:
 *     summary: Get task metrics
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   _count:
 *                     type: object
 */
export const getTaskMetrics = async (req, res) => {
  try {
    const metrics = await prisma.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    logger.info(`Task metrics retrieved by user: ${req.user.userId}`);
    res.json(metrics);
  } catch (error) {
    logger.error("Error retrieving task metrics:", {
      error: error.message,
      user: req.user.userId,
    });
    res.status(400).json({ error: error.message });
  }
};
