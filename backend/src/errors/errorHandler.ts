import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './validation.error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(`[Error]: ${err.message}`); 

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        });
    }

    return res.status(500).json({
        success: false,
        message: "Ocurrió un error interno en el servidor"
    });
}