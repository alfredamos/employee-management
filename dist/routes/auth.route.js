"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const employee_login_validation_middleware_1 = require("../middleware/employee-login-validation.middleware");
const employee_validation_middleware_1 = require("../middleware/employee-validation.middleware");
const router = (0, express_1.Router)();
router.route('/signup')
    .post(employee_validation_middleware_1.employeeValidationMiddleware, auth_controller_1.employeeSignUp);
router.route('/login')
    .post(employee_login_validation_middleware_1.employeeLoginValidationMiddleware, auth_controller_1.employeeLogin);
exports.default = router;
