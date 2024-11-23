// metrics.controllers.js
import { PrismaClient } from "@prisma/client";
import { PerformanceMetrics } from "../ai/metrics.js";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();
const metrics = new PerformanceMetrics();

// Get Lecturer Performance Metrics
export const getLecturerMetrics = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    const evaluations = await prisma.evaluation.findMany({
      where: { lecturerId },
      include: {
        evaluationMetrics: true,
        evaluated: true,
      },
    });

    const metricsData = await metrics.analyzeMetrics(evaluations);

    res.json({
      success: true,
      data: metricsData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Department Metrics
export const getDepartmentMetrics = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const lecturers = await prisma.user.findMany({
      where: {
        deptId: departmentId,
        role: "lecturer",
      },
      include: {
        evaluationsReceived: {
          include: {
            evaluationMetrics: true,
          },
        },
      },
    });

    const departmentMetrics = await Promise.all(
      lecturers.map(async (lecturer) => ({
        lecturerId: lecturer.userId,
        name: `${lecturer.fname} ${lecturer.lname}`,
        metrics: await metrics.analyzeMetrics(lecturer.evaluationsReceived),
      })),
    );

    res.json({
      success: true,
      data: departmentMetrics,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Trending Metrics
export const getTrendingMetrics = async (req, res) => {
  try {
    const { lecturerId } = req.params;
    const { period = "6months" } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    const evaluations = await prisma.evaluation.findMany({
      where: {
        lecturerId,
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        evaluationMetrics: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const trendData = await metrics.analyzeTrends(evaluations);

    res.json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
