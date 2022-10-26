import {body, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {postsRepositories} from "../repositories/posts-db-repositories";


//validation blogs
export const nameValidation = body('name').trim().notEmpty().isLength({max: 15}).withMessage("некорректно указано имя");
export const youtubeUrlValidation = body('youtubeUrl').notEmpty().isLength({max: 100}).isURL().withMessage("некорректно указан url");

// validation posts
export const isParamsIdTrue = (async (req: Request, res: Response, next: NextFunction) => {
    const isIdTrue = await postsRepositories.findPost(req.params.id);

    if (!isIdTrue) {
        return res.send(404);
    } else {
        next();
    }

});
export const titleValidation = body('title').trim().notEmpty().isLength({max: 30}).withMessage("некорректно указано название");
export const shortDescriptionValidation = body('shortDescription').trim().notEmpty().isLength({max: 100}).withMessage("некорректно указано описание");
export const contentValidation = body('content').trim().notEmpty().isLength({max: 1000}).withMessage("некорректно указан контент");
export const blogIdExistValidation = body('blogId').custom(async (value) => {
    const blogId = await postsRepositories.checkBlogId(value)
    if (!blogId) {
        throw new Error('некорректно указан blogId')
    }
    return true
});

// validation users
export const loginValidation = body('login').trim().notEmpty().isLength({max: 10, min: 3}).withMessage("некорректно указан login");
export const passwordValidation = body('password').trim().notEmpty().isLength({max: 20, min: 6}).withMessage("некорректно указан password");
export const emailValidation = body('email').trim().notEmpty().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage("некорректно указан email");


// result
export const checkResultErrorsMiddleware = ((req: Request, res: Response, next: NextFunction) => {
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