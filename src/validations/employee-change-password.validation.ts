import Joi from "joi";
import { EmployeeChangePassword } from "../models/employee-change-password.model";

const employeeChangePasswordSchema = Joi.object({
  email: Joi.string().required().email(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

export const employeeChangePasswordValidation = (employee: EmployeeChangePassword) => {
  const { email, oldPassword, newPassword, confirmPassword } = employee;

  return employeeChangePasswordSchema.validate({
    email,
    oldPassword,
    newPassword,
    confirmPassword,
  });
};
