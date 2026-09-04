import { Request, Response, NextFunction } from "express";
import { JsonError } from "../../errors/json.error";

export const JsonSyntaxError = (err: any, req: Request, res: Response,next: NextFunction) => {

    if (err instanceof SyntaxError && "status" in err && (err as any).status === 400 && "body" in err) {
        err = new JsonError("El JSON tiene errores en su estructura");
    }
    next(err);
};


export const validateEmptyBody = (req: Request,res: Response,next: NextFunction) => {
    const metodosConBody = ["POST", "PUT", "PATCH"];
    if (metodosConBody.includes(req.method)) {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new JsonError("El JSON está vacio")
        }
    }
    next();
};