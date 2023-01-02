"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_controller_1 = require("../controllers/department.controller");
const department_validation_middleware_1 = require("../middleware/department-validation.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(department_controller_1.getAllDepartments)
    .post(department_validation_middleware_1.departmentValidationMiddleware, department_controller_1.createDepartment);
router.route('/:id')
    .delete(department_controller_1.deleteDepartment)
    .get(department_controller_1.getDepartmentById)
    .patch(department_validation_middleware_1.departmentValidationMiddleware, department_controller_1.editDepartment);
exports.default = router;
