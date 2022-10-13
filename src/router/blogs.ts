import {NextFunction, Request, Response} from 'express'
import {Router} from "express";
import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {body, validationResult} from 'express-validator';


export const blogs = Router(); //вместо app теперь испльзуем router

//Validation and Authorization
const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const isAutorization = req.header('authorization') === 'Basic YWRtaW46cXdlcnR5';

    if (!isAutorization) {
        return res.send(401);
    } else {
        next();
    }
}
const nameValidation = body('name').trim().notEmpty().isLength({max: 15}).withMessage("некорректно указано имя");
const youtubeUrlValidation = body('youtubeUrl').notEmpty().isLength({max: 100}).isURL().withMessage("некорректно указан url");
const checkResultErrorsMiddleware = ((req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const allError = errors.array({onlyFirstError: true}).map(el => {
            return {
                "message": el.msg,
                "field": el.param
            }
        })

        return res.status(400).json({errorsMessages: allError});
    }

    next();
});


blogs.get('/', async (req: Request, res: Response) => {
    const foundBlogs = await blogsRepositories.findBlogs();
    foundBlogs.map((el) => {
        delete el['_id'];
    })

    res.status(200).send(foundBlogs);
});

blogs.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    let foundBlog = await blogsRepositories.findBlog(id);

    if (foundBlog) {
        delete foundBlog._id;
        res.send(foundBlog);

    } else {
        res.send(404);
    }
});

blogs.post('/', authorizationMiddleware, nameValidation, youtubeUrlValidation, checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {

        const newBlog = await blogsRepositories.createBlog(req.body.name, req.body.youtubeUrl);

        res.status(201).send(newBlog)
    }
)

blogs.delete('/:id', authorizationMiddleware, async (req: Request, res: Response) => {

    const id = req.params.id;

    let isDeletedBlog = await blogsRepositories.deleteBlog(id);

    if (isDeletedBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
});

blogs.put('/:id', authorizationMiddleware, nameValidation, youtubeUrlValidation, checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {

        const id = req.params.id;
        const newName = req.body.name;
        const newUrl = req.body.youtubeUrl;
        const isBlogUpdate = await blogsRepositories.updateBlog(id, newName, newUrl);

        if (!isBlogUpdate) {
            return res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }

    }
);
