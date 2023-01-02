import { HttpError } from "http-errors";
import {Request, Response, NextFunction} from "express";
import { StatusCodes } from 'http-status-codes';

export const errorHandlerMiddleware = (error:HttpError, req: Request, res: Response, next: NextFunction) =>{
    
    if (error.status === StatusCodes.BAD_REQUEST || error.status === StatusCodes.NOT_FOUND){
        return res.status(error.status).json({
            message: error.message,
            name: error.name
        })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        name: 'Internal Server Error',
    })
    
    
}