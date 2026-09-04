import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './../../errors/validation.error';

export const validateSchema = (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body); 

    if (!resultado.success) {
      const formattedErrors = resultado.error.issues.map(e => ({
        campo: e.path.join('.'),
        mensaje: e.message
      }));
      return next(new ValidationError("Error de validación de datos", formattedErrors));
    }

    req.body = resultado.data; 
    next();
  };