import {Request, Response} from 'express'
import {Router} from "express";
import {dataBase} from "../data";

export const router = Router();
//вместо app теперь испльзуем router


router.get('', (req: Request, res: Response) => {
    res.send(dataBase);
});

router.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const data = dataBase.find(el => el['id'] === +id);

    if (data) {
        res.send(data);

    } else {
        res.send(404);
    }
})

router.delete('/:id', (req: Request, res: Response) => {
    const id = +req.params.id;

    for (let i = 0; i < dataBase.length; i++) {
        if (dataBase[i].id === id) {
            dataBase.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});

router.post('', (req: Request, res: Response) => {
    const date = new Date();

    const newVideo = {
        "id": +new Date(),
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": date.toISOString(),
        "publicationDate": date.toISOString(),
        "availableResolutions": [
            "P144"
        ]
    }

    dataBase.push(newVideo);

    res.status(201).send(newVideo);
});

router.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const newDate = new Date();

    if (Object.keys(req.body).length !== 0) {
        for (let i = 0; i < dataBase.length; i++) {
            if (dataBase[i].id === id) {

                dataBase[i].title = req.body.title;
                dataBase[i].author = req.body.author;
                dataBase[i].availableResolutions = req.body.availableResolutions;
                dataBase[i].canBeDownloaded = req.body.canBeDownloaded;
                dataBase[i].minAgeRestriction = req.body.minAgeRestriction;
                dataBase[i].publicationDate = req.body.publicationDate;

                res.send(201); //Created
                return;
            }
        }

        res.send(404); //Not Found
    }

    res.send(204); //No Content

});


type BodyRequestPostVideo = {
    "title": "string",
    "author": "string",
    "availableResolutions": [
        "P144"
    ]
}

type NewVideos = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: Array<string>
}

type IncorrectVideos = {
    errorsMessages: {
        message: "string",
        field: "string"
    }
}


