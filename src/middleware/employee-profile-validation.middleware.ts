import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { Employee } from "../models/employee.model";
import { employeeProfileValidation } from "../validations/employee-profile.validation";
import { Request, Response, NextFunction } from "express";

export const employeeProfileValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body: employee } = req;
  const employeeVar = employee as Employee;
  const { error, value } = employeeProfileValidation(employeeVar);

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
