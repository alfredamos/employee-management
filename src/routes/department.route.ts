import { Router } from "express";


import { checkIfAuthenticatedMiddleware } from "../middleware/check-if-authenticated.middleware";
import { checkIfAdmin } from "../middleware/check-if-admin.middleware";


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
    .get(
        checkIfAuthenticatedMiddleware, 
        getAllDepartments)
    .post(
        departmentValidationMiddleware, 
        checkIfAuthenticatedMiddleware, checkIfAdmin, 
        createDepartment);

router
  .route("/:id")
  .delete(checkIfAuthenticatedMiddleware, checkIfAdmin, deleteDepartment)
  .get(checkIfAuthenticatedMiddleware, getDepartmentById)
  .patch(
    departmentValidationMiddleware,
    checkIfAuthenticatedMiddleware,
    checkIfAdmin,
    editDepartment
  );

export default router;