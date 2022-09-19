import {Request, Response} from 'express'
import {Router} from "express";
import {dataBase} from "../data";

export const allDelete = Router();


allDelete.delete('/api/testing/all-data', (req: Request, res: Response) => {
   dataBase.splice(0,  dataBase.length);

    res.status(204).send("All data is deleted");
});

