import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Employee } from "../models/employee.model";
import { employeeLoginValidation } from "../validations/employee-login.validation";

export const employeeLoginValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body: employ } = req;
  const employee = employ as Employee;

  const { error, value } = employeeLoginValidation(employee);

  if (error) {
    let errorMessages: string;

    errorMessages = error.details.map(err => err.message).join('. ');

    throw createError(
      StatusCodes.BAD_REQUEST,
      `${errorMessages} - please provides all required values.`
    );
  }

  next();

  return value;
};
