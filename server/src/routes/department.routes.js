// department.routes.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentUsers,
} from "../controllers/department.controllers.js";

const router = Router();

router.post("/create", authenticateToken, createDepartment);
router.get("/", authenticateToken, getAllDepartments);
router.get("/:departmentId", authenticateToken, getDepartmentById);
router.patch("/:departmentId", authenticateToken, updateDepartment);
router.delete("/:departmentId", authenticateToken, deleteDepartment);
router.get("/:departmentId/users", authenticateToken, getDepartmentUsers);

export default router;
