import {Request, Response, Router} from "express";
import {authorizationMiddleware} from "../middleware/authorization-middleware";
import {
    checkResultErrorsMiddleware,
    emailValidation,
    loginValidation,
    passwordValidation,
} from "../middleware/validation-middleware";
import {usersService} from "../services/users-service";
import {usersRepositories} from "../repositories/users-db-repositories";


export const users = Router();

users.get('/',  async (req: Request, res: Response) => {
    const searchLoginTerm = typeof req.query.searchLoginTerm === "string" ? req.query.searchLoginTerm : "";
    const searchEmailTerm = typeof req.query.searchEmailTerm === "string" ? req.query.searchEmailTerm : "";
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "desc";

    const queryParams = {
        searchLoginTerm,
        searchEmailTerm,
        pageNumber, pageSize,
        sortBy,
        sortDirection
    }
    const foundUsers = await usersRepositories.findUsers(queryParams);

    res.status(200).send(foundUsers);
})

users.post('/', authorizationMiddleware, loginValidation,
    passwordValidation, emailValidation, checkResultErrorsMiddleware,
    async (req: Request, res: Response) => {

        const newUser = await usersService.createUser(req.body.login, req.body.password, req.body.email);

        res.status(201).send(newUser)
    }
);

users.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {

    const id = req.params.id

    const isDeletedUser = await usersRepositories.deleteUserById(id)

    if (isDeletedUser) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})


export type queryParamsType = {
    searchLoginTerm: string | undefined,
    searchEmailTerm: string | undefined,
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: string
}



