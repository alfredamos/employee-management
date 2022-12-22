import { Router } from "express";

import {
    createEmployee,
    deleteEmployee,
    editEmployee,
    getAllEmployees,
    getEmployeeById
} from "../controllers/employee.controller";

import { employeeValidationMiddleware } from "../middleware/employee-validation.middleware";

const router = Router();

router.route('/')
    .get(getAllEmployees)
    .post(employeeValidationMiddleware, createEmployee);

router.route('/:id')
    .delete(deleteEmployee)
    .get(getEmployeeById)
    .patch(employeeValidationMiddleware, editEmployee);

export default router;