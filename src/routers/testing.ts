import {Request, Response} from 'express'
import {Router} from "express";
import {dataVideos} from "../data";

export const testing = Router();


testing.delete('/all-data', (req: Request, res: Response) => {
   dataVideos.splice(0,  dataVideos.length);

    res.sendStatus(204);  //204 No Content
});

