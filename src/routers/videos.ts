import {Request, Response} from 'express'
import {Router} from "express";
import {dataVideos} from "../data";

export const videos = Router(); //вместо app теперь испльзуем router


const availableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];

let isAvailableResolutions = (resolutions: string[]) => {
    return resolutions.every(item => availableResolutions.includes(item))
};


videos.get('/', (req: Request, res: Response) => {
    res.send(dataVideos);
});

videos.get('/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const data = dataVideos.find(el => el['id'] === +id);

    if (data) {
        res.send(data);

    } else {
        res.send(404);
    }
})

videos.delete('/:id', (req: Request, res: Response) => {
    const id = +req.params.id;

    for (let i = 0; i < dataVideos.length; i++) {
        if (dataVideos[i].id === id) {
            dataVideos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});

videos.post('/', (req: Request, res: Response) => {
    let nowDate = new Date();

    //add 1 day for publicationDate
    let publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);

    let errorMessage = [];

    if (Object.keys(req.body).length !== 0) {

        if (req.body.title === null || !req.body.title.trim() || req.body.title.length > 40) {
            errorMessage.push({
                "message": "не корректно заполненное название",
                "field": "title"
            })
        }

        if (!req.body.author.trim() || req.body.author.length > 20) {
            errorMessage.push({
                "message": "не корректно указан автор",
                "field": "author"
            })
        }

        if (req.body.availableResolutions.length === 0) {
            errorMessage.push({
                "message": "не указана резолючия",
                "field": "availableResolutions"
            })
        }

        if (!isAvailableResolutions(req.body.availableResolutions)) {
            errorMessage.push({
                "message": "не правильно указана резолюция",
                "field": "availableResolutions"
            })
        }

        if (errorMessage.length > 0) {
            res.status(400).send({errorsMessages: errorMessage});
        } else {
            const newVideo = {
                "id": +new Date(),
                "title": req.body.title,
                "author": req.body.author,
                "canBeDownloaded": false,
                "minAgeRestriction": null,
                "createdAt": nowDate.toISOString(),
                "publicationDate": publicationDate.toISOString(),
                "availableResolutions": [
                    "P144"
                ]
            }
            dataVideos.push(newVideo);

            res.status(201).send(newVideo);
        }
    }
});

videos.put('/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    let errorMessage = [];

    if (Object.keys(req.body).length !== 0) {

        if (req.body.title === null || !req.body.title.trim() || req.body.title.length > 40) {
            errorMessage.push({
                "message": "не корректно заполненное название",
                "field": "title"
            })
        }

        if (!req.body.author.trim() || req.body.author.length > 20) {
            errorMessage.push({
                "message": "не корректно указан автор",
                "field": "author"
            })
        }

        if (req.body.availableResolutions.length === 0) {
            errorMessage.push({
                "message": "не указана резолючия",
                "field": "availableResolutions"
            })
        }

        if (typeof req.body.canBeDownloaded !== "boolean") {
            errorMessage.push({
                "message": "необходимоу указать булево значение",
                "field": "canBeDownloaded"
            })
        }

        if (req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
            errorMessage.push({
                "message": "необходимоу указать корректный возраст",
                "field": "minAgeRestriction"
            })
        }

        if (req.body.publicationDate) {
            const validDate = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/.test(req.body.publicationDate);

            if (!validDate) {
                errorMessage.push({
                    "message": "не корректно указана дата",
                    "field": "publicationDate"
                })
            }
        }

        if (errorMessage.length > 0) {
            res.status(400).send({errorsMessages: errorMessage});
        }

        for (let i = 0; i < dataVideos.length; i++) {
            if (dataVideos[i].id === id) {

                dataVideos[i].title = req.body.title;
                dataVideos[i].author = req.body.author;
                dataVideos[i].availableResolutions = req.body.availableResolutions;
                dataVideos[i].canBeDownloaded = req.body.canBeDownloaded;
                dataVideos[i].minAgeRestriction = req.body.minAgeRestriction;
                dataVideos[i].publicationDate = req.body.publicationDate;

                res.send(204); //No Content
                return;
            }
        }

        res.send(404); //Not Found
    }

    res.send(204); //No Content
});



//types
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