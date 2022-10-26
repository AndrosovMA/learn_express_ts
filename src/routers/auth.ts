import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {checkResultErrorsMiddleware, loginValidation, passwordValidation} from "../middleware/validation-middleware";

export const auth = Router();

auth.post('/login', loginValidation, passwordValidation,
    checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {

        const login = req.body.login;
        const password = req.body.password;

        const isCheckCredentials = await usersService.checkCredentials(login, password);

        if (isCheckCredentials) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(401)
        }

    })
