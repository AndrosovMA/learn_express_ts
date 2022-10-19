import {Request, Response} from 'express'
import {Router} from "express";
import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {authorizationMiddleware} from "../middleware/authorization-middleware";
import {
    checkResultErrorsMiddleware, contentValidation,
    nameValidation, shortDescriptionValidation,
    titleValidation,
    youtubeUrlValidation
} from "../middleware/validation-middleware";
import {postsRepositories} from "../repositories/posts-db-repositories";


export const blogs = Router();


blogs.get('/', async (req: Request, res: Response) => {
    const searchNameTerm = typeof req.query.searchNameTerm === "string" ? req.query.searchNameTerm : "";
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "desc";

    const foundBlogs = await blogsRepositories.findBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection);

    res.status(200).send(foundBlogs);
});

blogs.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    let foundBlog = await blogsRepositories.findBlog(id);

    if (foundBlog) {
        res.send(foundBlog);

    } else {
        res.send(404);
    }
});

blogs.get('/:blogId/posts', async (req: Request, res: Response) => {
    const blogId = req.params.blogId;
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "desc";
    const isBlogId = await postsRepositories.checkBlogId(blogId);

    if (!isBlogId) {
        res.send(404)
    } else {

        let foundPosts = await postsRepositories.findPostsByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection);

        if (foundPosts) {
            res.status(200).send(foundPosts);

        } else {
            res.send(404);
        }

    }

});

blogs.post('/', authorizationMiddleware, nameValidation, youtubeUrlValidation, checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {

        const newBlog = await blogsRepositories.createBlog(req.body.name, req.body.youtubeUrl);

        res.status(201).send(newBlog)
    }
);

blogs.post('/:blogId/posts', authorizationMiddleware, titleValidation,
    shortDescriptionValidation, contentValidation, checkResultErrorsMiddleware,

    async (req: Request, res: Response) => {
        const blogId = req.params.blogId;
        const isBlogId = await postsRepositories.checkBlogId(blogId);

        if (!isBlogId) {
            res.send(404)
        } else {
            const newBlog = await postsRepositories.createPost(req.body.title, req.body.shortDescription, req.body.content, blogId);

            res.status(201).send(newBlog)
        }
    }
);

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


//   "/blogs?searchNameTerm=prob&pageNumber=1&pageSize=10&sortBy=createdAt&sortDirection=desc"

