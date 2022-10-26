import {Request, Response} from 'express'
import {Router} from "express";
import {dataVideos} from "../data";
import {blogsRepositories} from "../repositories/blogs-db-repositories";
import {postsRepositories} from "../repositories/posts-db-repositories";
import {usersRepositories} from "../repositories/users-db-repositories";

export const testing = Router();


testing.delete('/all-data', async (req: Request, res: Response) => {
   dataVideos.splice(0,  dataVideos.length);
    await blogsRepositories.deleteAllData();
    await postsRepositories.deleteAllData();
    await usersRepositories.deleteAllData();

    res.sendStatus(204);  //204 No Content
});

