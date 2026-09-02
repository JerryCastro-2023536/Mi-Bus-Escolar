import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './validation.error';
import { DatabaseError } from './database.error';
import { InternalError } from './500.error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(`[Error]: ${err.message}`); 

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    if (err instanceof DatabaseError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err.error
        })
    }

    if (err instanceof InternalError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }
}