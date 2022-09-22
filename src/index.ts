import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {allDeleteRouter} from "./router/allDeleteRouter";
import {dataBase} from "./data";
import {isBoolean} from "util";

const app = express();

const port = process.env.PORT || 3003;

const parserMiddleware = bodyParser();
app.use(parserMiddleware)


app.get('/videos', (req: Request, res: Response) => {
    res.send(dataBase);
});

app.get('/videos/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    const data = dataBase.find(el => el['id'] === +id);

    if (data) {
        res.send(data);

    } else {
        res.send(404);
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
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

app.post('/videos', (req: Request, res: Response) => {
    let nowDate = new Date();

    //add 1 day for publicationDate
    let publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() + 1);

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

    dataBase.push(newVideo);

    res.status(201).send(newVideo);
});

app.put('/videos/:id', (req: Request, res: Response) => {
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
                const validDate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.test(req.body.publicationDate);

                errorMessage.push({
                    "message": "не корректно указана дата",
                    "field": "publicationDate"
                })
            }

            if (errorMessage.length > 0) {
                res.status(400).send({errorsMessages: errorMessage});
            }

            for (let i = 0; i < dataBase.length; i++) {
                if (dataBase[i].id === id) {

                    dataBase[i].title = req.body.title;
                    dataBase[i].author = req.body.author;
                    dataBase[i].availableResolutions = req.body.availableResolutions;
                    dataBase[i].canBeDownloaded = req.body.canBeDownloaded;
                    dataBase[i].minAgeRestriction = req.body.minAgeRestriction;
                    dataBase[i].publicationDate = req.body.publicationDate;

                    res.send(204); //No Content
                    return;
                }
            }

            res.send(404); //Not Found
        }

        res.send(204); //No Content
    }
)


app.use('/testing', allDeleteRouter);


//start app
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
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

type AvailableResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']



