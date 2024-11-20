// evaluations.controllers.js
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export const createEvaluation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { feedback, rating, studentId, lecturerId } = req.body;

    // Validate student exists and has student role
    const student = await prisma.user.findFirst({
      where: {
        userId: studentId,
        role: 'student'
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found or user is not a student"
      });
    }

    // Validate lecturer exists and has lecturer role
    const lecturer = await prisma.user.findFirst({
      where: {
        userId: lecturerId,
        role: 'lecturer'
      }
    });

    if (!lecturer) {
      return res.status(404).json({
        success: false,
        error: "Lecturer not found or user is not a lecturer"
      });
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        feedback,
        rating,
        studentId: student.userId,
        lecturerId: lecturer.userId
      },
      include: {
        evaluator: true,
        evaluated: true
      }
    });

    res.status(201).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
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
