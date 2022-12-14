import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {checkResultErrorsMiddleware, loginValidation, passwordValidation} from "../middleware/validation-middleware";

export const auth = Router();

auth.post('/login', //loginValidation, passwordValidation,
   // checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {

        const login = req.body.login;
        const password = req.body.password;

        if(login === undefined) {
            return res.status(400).send({
                errorsMessages: [{message: 'Invalid login', field: 'login'}]
            })
        }

        if(password === undefined) {
            return res.status(400).send({
                errorsMessages: [{message: 'Invalid password', field: 'password'}]
            })
        }

        const isCheckCredentials = await usersService.checkCredentials(login, password);

        if (isCheckCredentials) {
            return res.sendStatus(204)
        } else {
            console.log("Send 401")
            return res.sendStatus(401)
        }

    })
