"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_if_authenticated_middleware_1 = require("../middleware/check-if-authenticated.middleware");
const check_if_admin_middleware_1 = require("../middleware/check-if-admin.middleware");
const employee_controller_1 = require("../controllers/employee.controller");
const employee_validation_middleware_1 = require("../middleware/employee-validation.middleware");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, employee_controller_1.getAllEmployees)
    .post(employee_validation_middleware_1.employeeValidationMiddleware, check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, check_if_admin_middleware_1.checkIfAdmin, employee_controller_1.createEmployee);
router
    .route("/:id")
    .delete(check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, check_if_admin_middleware_1.checkIfAdmin, employee_controller_1.deleteEmployee)
    .get(check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, employee_controller_1.getEmployeeById)
    .patch(employee_validation_middleware_1.employeeValidationMiddleware, check_if_authenticated_middleware_1.checkIfAuthenticatedMiddleware, check_if_admin_middleware_1.checkIfAdmin, employee_controller_1.editEmployee);
exports.default = router;
