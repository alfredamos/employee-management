"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = require("../controllers/employee.controller");
const employee_validation_middleware_1 = require("../middleware/employee-validation.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(employee_controller_1.getAllEmployees)
    .post(employee_validation_middleware_1.employeeValidationMiddleware, employee_controller_1.createEmployee);
router.route('/:id')
    .delete(employee_controller_1.deleteEmployee)
    .get(employee_controller_1.getEmployeeById)
    .patch(employee_validation_middleware_1.employeeValidationMiddleware, employee_controller_1.editEmployee);
exports.default = router;
