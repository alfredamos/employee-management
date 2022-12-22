import { HttpError } from "http-errors";
import {Request, Response, NextFunction} from "express";

export const errorHandlerMiddleware = (error:HttpError, req: Request, res: Response, next: NextFunction) =>{
    return res.status(error.status).json({
        message: error.message,
    })
}