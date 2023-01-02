import { Router } from "express";
import {employeeLogin, employeeSignUp} from "../controllers/auth.controller";

import {employeeLoginValidationMiddleware} from "../middleware/employee-login-validation.middleware"
import { employeeValidationMiddleware } from "../middleware/employee-validation.middleware";

const router = Router();

router.route('/signup')
   .post(employeeValidationMiddleware, employeeSignUp);

router.route('/login')
  .post(employeeLoginValidationMiddleware, employeeLogin);

export default router;
