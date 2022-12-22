import { Router } from "express";

import {
    createDepartment,
    deleteDepartment,
    editDepartment,
    getAllDepartments,
    getDepartmentById
} from "../controllers/department.controller";

import { departmentValidationMiddleware } from "../middleware/department-validation.middleware";

const router = Router();

router.route('/')
    .get(getAllDepartments)
    .post(departmentValidationMiddleware, createDepartment);

router.route('/:id')
    .delete(deleteDepartment)
    .get(getDepartmentById)
    .patch(departmentValidationMiddleware, editDepartment);

export default router;