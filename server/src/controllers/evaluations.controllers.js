// evaluations.controllers.js
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import { PerformanceAnalyzer } from "../ai/deberta.js";

const prisma = new PrismaClient();

const analyzer = new PerformanceAnalyzer();

// evaluations.controllers.js
export const createEvaluation = async (req, res) => {
  try {
    const { lecturerId } = req.params; // Get lecturer ID from params
    const studentId = req.user.userId; // Get student ID from authenticated user
    const { feedback, rating } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify authenticated user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        error: "Only students can submit evaluations",
      });
    }

    // Validate lecturer exists
    const lecturer = await prisma.user.findFirst({
      where: {
        userId: lecturerId,
        role: "lecturer",
      },
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found",
      });
    }

    // Check if student already evaluated this lecturer
    const existingEvaluation = await prisma.evaluation.findFirst({
      where: {
        studentId,
        lecturerId,
      },
    });

    if (existingEvaluation) {
      return res.status(400).json({
        success: false,
        error: "You have already evaluated this lecturer",
      });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        feedback,
        rating,
        studentId,
        lecturerId,
      },
      include: {
        evaluator: true,
        evaluated: true,
      },
    });
    const aiAnalysis = await analyzer.analyzePerformance({
      feedback,
      rating,
    });

    // Store AI analysis results
    await prisma.evaluationMetrics.create({
      data: {
        evaluationId: evaluation.evaluationId,
        aiScores: aiAnalysis,
        timestamp: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get All Evaluations
export const getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        evaluator: true,
        evaluated: true,
      },
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Evaluation by ID
export const getEvaluationById = async (req, res) => {
  try {
    const { evaluationId } = req.params;

    const evaluation = await prisma.evaluation.findUnique({
      where: { evaluationId },
      include: {
        evaluator: true,
        evaluated: true,
      },
    });

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: "Evaluation not found",
      });
    }

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update Evaluation
export const updateEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;
    const { feedback, rating } = req.body;

    const evaluation = await prisma.evaluation.update({
      where: { evaluationId },
      data: {
        feedback,
        rating,
      },
      include: {
        evaluator: true,
        evaluated: true,
      },
    });

    res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Evaluation
export const deleteEvaluation = async (req, res) => {
  try {
    const { evaluationId } = req.params;

    await prisma.evaluation.delete({
      where: { evaluationId },
    });

    res.json({
      success: true,
      message: "Evaluation deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Evaluations by Student
export const getStudentEvaluations = async (req, res) => {
  try {
    const { studentId } = req.params;

    const evaluations = await prisma.evaluation.findMany({
      where: { studentId },
      include: {
        evaluator: true,
      },
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Evaluations by Lecturer
export const getLecturerEvaluations = async (req, res) => {
  try {
    const { lecturerId } = req.params;

    const evaluations = await prisma.evaluation.findMany({
      where: { lecturerId },
      include: {
        evaluated: true,
      },
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Evaluations by Staff
export const getStaffEvaluations = async (req, res) => {
  try {
    const { staffId } = req.params;

    const evaluations = await prisma.evaluation.findMany({
      where: { staffId },
      include: {
        evaluated: true,
      },
    });

    res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
