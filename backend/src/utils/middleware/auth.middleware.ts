import { userRol } from './../../enums/userRol';
import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../jwt';
import { AuthorizationError } from '../../errors/auth.error';
import { InvalidToken } from '../../errors/expiredToken.error';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string | number;
                email: string;
                rol: userRol;
            };
        }
    }
}

export { };
export const verificarAutenticacion = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthorizationError("Sin informacion del usario")
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verificarToken(token);
        req.user = payload;
        next();
    } catch (error) {
        throw new InvalidToken("Token Invalido");
    }
};