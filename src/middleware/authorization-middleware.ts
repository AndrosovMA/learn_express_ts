import {NextFunction, Request, Response} from "express";

export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const isAutorization = req.header('authorization') === 'Basic YWRtaW46cXdlcnR5';  // Basic admin:qwerty

    if (!isAutorization) {
        return res.send(401);
    } else {
        next();
    }
};