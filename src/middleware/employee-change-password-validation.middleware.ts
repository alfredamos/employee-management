import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { EmployeeChangePassword } from "../models/employee-change-password.model";
import { employeeChangePasswordValidation } from "../validations/employee-change-password.validation";
import { Request, Response, NextFunction } from "express";

export const employeeChangePasswordValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body: employee } = req;
  const employeeVar = employee as EmployeeChangePassword;

  const { error, value } = employeeChangePasswordValidation(employeeVar);

  if (error) {
    let errorMessages: string;

    errorMessages = error.details.map((err) => err.message).join(". ");

    next(
      createError(
        StatusCodes.BAD_REQUEST,
        `${errorMessages} - please provides all required values.`
      )
    );
    return;
  }

  next();

  return value;
};
