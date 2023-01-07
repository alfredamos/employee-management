import { Response, Request, NextFunction } from "express";
import catchError from "http-errors";
import * as jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const checkIfAuthenticatedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authJwtToken = req?.headers?.authorization?.split(" ")[1];

  //----> Empty authJwtToken
  if (!authJwtToken) {
    next(catchError(StatusCodes.FORBIDDEN, "Invalid credentials"));
    return;
  }

  verifyJwtToken(authJwtToken)
    .then((employeeInfo) => {
      req["employeeInfo"] = employeeInfo;

      next();
      return;
    })
    .catch((err) => {      
      next(catchError(StatusCodes.FORBIDDEN, "Invalid credentials"));
      return;
    });
};

async function verifyJwtToken(authToken: string) {
  return await jwt.verify(authToken, process.env.JSON_WEB_TOKEN);
}
/* 

class JsonWebTokenError extends jwt.JsonWebTokenError {
    constructor(message: string, err: any) {
        super(message, err);
        this.name = "JsonWebTokenError";
    }
} */
