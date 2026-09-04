import { Request, Response, NextFunction } from 'express';
import { userRol } from '../../enums/userRol';

export const permitirRoles = (...rolesPermitidos: userRol[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'No se encontró información del usuario en la sesión.'
            });
        }

        const { rol } = req.user;
        if (!rolesPermitidos.includes(rol)) {
            return res.status(403).json({
                error: `Acceso denegado. No cuenta cons los permisos necesarios`
            });
        }

        next();
    };
};