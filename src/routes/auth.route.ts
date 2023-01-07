import { Router } from "express";
import {
  changePasswordOfEmployee,
  employeeLogin,
  employeeSignUp,
  profileOfEmployee,
  profileOfEmployeeById,
} from "../controllers/auth.controller";

import { employeeLoginValidationMiddleware } from "../middleware/employee-login-validation.middleware";
import { employeeValidationMiddleware } from "../middleware/employee-validation.middleware";
import { employeeProfileValidationMiddleware } from "../middleware/employee-profile-validation.middleware";
import { employeeChangePasswordValidationMiddleware } from '../middleware/employee-change-password-validation.middleware';

const router = Router();

router
  .route("/change-password")
  .patch(employeeChangePasswordValidationMiddleware, changePasswordOfEmployee);

router.route("/login").post(employeeLoginValidationMiddleware, employeeLogin);

router
  .route("/profile")
  .patch(employeeProfileValidationMiddleware, profileOfEmployee);

router
  .route("/profile/:id")
  .patch(employeeProfileValidationMiddleware, profileOfEmployeeById);

router.route("/signup").post(employeeValidationMiddleware, employeeSignUp);

export default router;
