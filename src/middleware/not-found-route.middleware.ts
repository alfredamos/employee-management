import {Request, Response, NextFunction} from "express";
import { StatusCodes } from "http-status-codes";

export const notFoundRouteMiddleware = (req: Request, res: Response, next: NextFunction) => {
        
    return res.status(StatusCodes.NOT_FOUND).json({
        message: `Route does not exist on ${req.url}.`,
    })
}