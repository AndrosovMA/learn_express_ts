import {Request, Response} from 'express'
import {Router} from "express";
import {dataBase} from "../data";

export const testing = Router();


testing.delete('/all-data', (req: Request, res: Response) => {
   dataBase.splice(0,  dataBase.length);

    res.sendStatus(204);  //204 No Content
});

