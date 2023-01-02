import { Response, Request, NextFunction } from "express";
import { UserType } from "@prisma/client";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";

export const checkIfAdmin = (req: Request, res: Response, next: NextFunction) => {
    const userInfo = req['employeeInfo'];

    if (userInfo.userType !== UserType.Admin) {
        throw catchError(StatusCodes.UNAUTHORIZED, 'You are not authorized to perform this task.');
    }

    next();
}
