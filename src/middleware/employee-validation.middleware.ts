import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Employee } from "../models/employee.model";
import { employeeValidation } from "../validations/employee.validation";

export const employeeValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body: employ } = req;
  const employee = employ as Employee;

  const { error, value } = employeeValidation(employee);

  if (error) {
    let errorMessages: string[] = [];

    for (const err of error.details) {
      errorMessages.push(err.message);
    }

    throw createError(
      StatusCodes.BAD_REQUEST,
      `${errorMessages} - please provides all required values.`
    );
  }

  next();

  return value;
};
