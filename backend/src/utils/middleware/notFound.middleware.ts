import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../errors/notFound.error';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const error = new NotFoundError(`La ruta ${req.method} ${req.originalUrl} no existe en este servidor.`);
    next(error); 
};