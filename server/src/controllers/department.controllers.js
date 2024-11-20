// department.controllers.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Create Department
export const createDepartment = async (req, res) => {
  try {
    const { deptName, description } = req.body;

    const existingDepartment = await prisma.department.findFirst({
      where: { deptName },
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        error: "Department already exists",
      });
    }

    const department = await prisma.department.create({
      data: {
        deptName,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get All Departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            userId: true,
            fname: true,
            lname: true,
            role: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await prisma.department.findUnique({
      where: { departmentId },
      include: {
        users: {
          select: {
            userId: true,
            fname: true,
            lname: true,
            role: true,
          },
        },
      },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update Department
export const updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { deptName, description } = req.body;

    const existingDepartment = await prisma.department.findUnique({
      where: { departmentId },
    });

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    const department = await prisma.department.update({
      where: { departmentId },
      data: {
        deptName,
        description,
      },
    });

    res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const existingDepartment = await prisma.department.findUnique({
      where: { departmentId },
    });

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        error: "Department not found",
      });
    }

    await prisma.department.delete({
      where: { departmentId },
    });

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get Department Users
export const getDepartmentUsers = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const users = await prisma.user.findMany({
      where: { deptId: departmentId },
      select: {
        userId: true,
        fname: true,
        lname: true,
        email: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
