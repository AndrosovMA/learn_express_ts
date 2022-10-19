import {Request, Response} from 'express'
import {Router} from "express";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {authorizationMiddleware} from "../middleware/authorization-middleware";
import {
    blogIdExistValidation,
    checkResultErrorsMiddleware, contentValidation,
    isParamsIdTrue,
    shortDescriptionValidation,
    titleValidation
} from "../middleware/validation-middleware";

export const posts = Router();


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
