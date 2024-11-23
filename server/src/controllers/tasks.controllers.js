import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createTask = async (req, res) => {
  try {
    const { title, description, startDate, completionDate } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        startDate,
        completionDate,
        status: "pending",
      },
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    res
      .status(500)
      .json({ success: false, message: "Please refresh your browser" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { taskId: req.params.taskId },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
    res
      .status(500)
      .json({ message: "Server error. Please refresh your browser" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.params;

    // First check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }
    const task = await prisma.task.update({
      where: { taskId: req.params.taskId },
      data: {
        ...req.body,
        creatorId: userId,
      },
    });
    res.json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({
      where: { taskId: req.params.taskId },
    });
    res
      .status(204)
      .send({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    res.status(500).json({
      success: false,
      message: "Server error. Please refresh your browser",
    });
  }
};

// Task Assignment
export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assigneeId } = req.body;

    // Verify lecturer exists
    const lecturer = await prisma.user.findFirst({
      where: {
        userId: assigneeId,
        role: "lecturer",
      },
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found",
      });
    }

    const assignment = await prisma.taskAssignment.create({
      data: {
        taskId,
        assignee_id: assigneeId,
        status: "pending",
      },
      include: {
        assignee: true,
        task: true,
      },
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Task Status Management
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { taskId: taskId },
      data: { status },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Task Tracking & Metrics
export const getTasksByUser = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { creatorId: req.params.userId },
          {
            assignments: {
              some: {
                assignee_id: req.params.userId,
              },
            },
          },
        ],
      },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getTasksByDepartment = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        creator: {
          deptId: req.params.deptId,
        },
      },
      include: {
        creator: true,
        assignments: {
          include: {
            assignee: true,
          },
        },
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTaskMetrics = async (req, res) => {
  try {
    const metrics = await prisma.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
