import { Router } from "express";

import { checkIfAuthenticatedMiddleware } from "../middleware/check-if-authenticated.middleware";
import { checkIfAdmin } from "../middleware/check-if-admin.middleware";

import {
    createEmployee,
    deleteEmployee,
    editEmployee,
    getAllEmployees,
    getEmployeeById
} from "../controllers/employee.controller";

import { employeeValidationMiddleware } from "../middleware/employee-validation.middleware";

const router = Router();

router
  .route("/")
  .get(checkIfAuthenticatedMiddleware, getAllEmployees)
  .post(
    employeeValidationMiddleware,
    checkIfAuthenticatedMiddleware,
    checkIfAdmin,
    createEmployee
  );

router
  .route("/:id")
  .delete(checkIfAuthenticatedMiddleware, checkIfAdmin, deleteEmployee)
  .get(checkIfAuthenticatedMiddleware, getEmployeeById)
  .patch(
    employeeValidationMiddleware,
    checkIfAuthenticatedMiddleware,
    checkIfAdmin,
    editEmployee
  );

export default router;