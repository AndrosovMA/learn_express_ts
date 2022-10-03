import {Request, Response} from 'express'
import {Router} from "express";
import {dataPosts} from "../data";


export const posts = Router(); //вместо app теперь испльзуем router

posts.get('/', (req: Request, res: Response) => {
    res.send(dataPosts);
});