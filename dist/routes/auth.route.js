"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const employee_login_validation_middleware_1 = require("../middleware/employee-login-validation.middleware");
const employee_validation_middleware_1 = require("../middleware/employee-validation.middleware");
const employee_profile_validation_middleware_1 = require("../middleware/employee-profile-validation.middleware");
const employee_change_password_validation_middleware_1 = require("../middleware/employee-change-password-validation.middleware");
const router = (0, express_1.Router)();
router
    .route("/change-password")
    .patch(employee_change_password_validation_middleware_1.employeeChangePasswordValidationMiddleware, auth_controller_1.changePasswordOfEmployee);
router.route("/login").post(employee_login_validation_middleware_1.employeeLoginValidationMiddleware, auth_controller_1.employeeLogin);
router
    .route("/profile")
    .patch(employee_profile_validation_middleware_1.employeeProfileValidationMiddleware, auth_controller_1.profileOfEmployee);
router
    .route("/profile/:id")
    .patch(employee_profile_validation_middleware_1.employeeProfileValidationMiddleware, auth_controller_1.profileOfEmployeeById);
router.route("/signup").post(employee_validation_middleware_1.employeeValidationMiddleware, auth_controller_1.employeeSignUp);
exports.default = router;
