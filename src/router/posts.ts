import {NextFunction, Request, Response} from 'express'
import {Router} from "express";
import {body, validationResult} from "express-validator";
import {postsRepositories} from "../repositories/posts-db-repositories";

export const posts = Router(); //вместо app теперь испльзуем router

//Validation and Authorization
const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const isAutorization = req.header('authorization') === 'Basic YWRtaW46cXdlcnR5';

    if (!isAutorization) {
        return res.send(401);
    } else {
        next();
    }
};
const isParamsIdTrue = (async (req: Request, res: Response, next: NextFunction) => {
    const isIdTrue = await postsRepositories.findPost(req.params.id);

    if (!isIdTrue) {
        return res.send(404);
    } else {
        next();
    }

});
const titleValidation = body('title').trim().notEmpty().isLength({max: 30}).withMessage("некорректно указано название");
const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isLength({max: 100}).withMessage("некорректно указано описание");
const contentValidation = body('content').trim().notEmpty().isLength({max: 1000}).withMessage("некорректно указан контент");
const blogIdExistValidation = body('blogId').custom(async (value) => {
    const blogId = await postsRepositories.checkBlogId(value)
    if (!blogId) {
        throw new Error('некорректно указан blogId')
    }
    return true
});
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



posts.get('/', async (req: Request, res: Response) => {
    const foundPosts = await postsRepositories.findPosts()

    res.status(200).send(foundPosts);
});

posts.get('/:id', isParamsIdTrue, async (req: Request, res: Response) => {
    const id = req.params.id;

    const foundPost = await postsRepositories.findPost(id)

    if (foundPost) {
        res.send(foundPost);

    } else {
        res.send(404);
    }
});

posts.post('/', authorizationMiddleware, titleValidation, shortDescriptionValidation,
    contentValidation, blogIdExistValidation, checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {

        const newPost = await postsRepositories.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

        if (!newPost) res.status(400).send({
            "errorsMessages": [
                {
                    "message": "некорректно указан blogId",
                    "field": "blogName"
                }
            ]
        })

        res.status(201).send(newPost)
    }
);

posts.delete('/:id', authorizationMiddleware, isParamsIdTrue, async (req: Request, res: Response) => {

    const id = req.params.id;

    let isDeletedBlog = await postsRepositories.deletePost(id);

    if (isDeletedBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
});

posts.put('/:id', authorizationMiddleware, isParamsIdTrue, titleValidation, shortDescriptionValidation,
    contentValidation, blogIdExistValidation, checkResultErrorsMiddleware,

    (req: Request, res: Response) => {

        const id = req.params.id;
        const newtitle = req.body.title;
        const newShortDescription = req.body.shortDescription;
        const newContent = req.body.content;
        const newBlogId = req.body.blogId;

        const isPostUpdate = postsRepositories.updatePost(id, newtitle, newShortDescription, newContent, newBlogId);

        if (!isPostUpdate) {
            return res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }

    }
);
