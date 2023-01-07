"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_if_authenticated_middleware_1 = require("../middleware/check-if-authenticated.middleware");
const check_if_admin_middleware_1 = require("../middleware/check-if-admin.middleware");
const department_controller_1 = require("../controllers/department.controller");
const department_validation_middleware_1 = require("../middleware/department-validation.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(
// checkIfAuthenticatedMiddleware, 
department_controller_1.getAllDepartments)
    .post(department_validation_middleware_1.departmentValidationMiddleware, 
// checkIfAuthenticatedMiddleware, checkIfAdmin, 
department_controller_1.createDepartment);
router
    .route("/:id")
    .delete(check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, check_if_admin_middleware_1.checkIfAdmin, department_controller_1.deleteDepartment)
    .get(check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, department_controller_1.getDepartmentById)
    .patch(department_validation_middleware_1.departmentValidationMiddleware, check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, check_if_admin_middleware_1.checkIfAdmin, department_controller_1.editDepartment);
exports.default = router;
