import createError from "http-errors";
import {Request, Response, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import {Department} from "../models/department.model";
import {departmentValidation} from "../validations/department.validation";

export const departmentValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const {body: depart} = req;
    const department = depart as Department;

    const {error, value} = departmentValidation(department);

    if (error){
        let errorMessages: string;

        errorMessages = error.details.map(err => err.message).join('. ');

        next(createError(StatusCodes.BAD_REQUEST, `${errorMessages} - please provides all required values.`));
        return;
    }

    next();

    return value;
}