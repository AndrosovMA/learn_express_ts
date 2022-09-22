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

    if (Object.keys(req.body).length !== 0) {


        if (!req.body.title.trim() || req.body.title.length > 40)  {
            let errorMessage = [
                {
                    "message": "не корректно заполненное название",
                    "field": "title"
                }
            ]
            res.status(400).send(errorMessage);
        }

        if (!req.body.author.trim() || req.body.author.length > 20) {
            let errorMessage = [
                {
                    "message": "не корректно указан автор",
                    "field": "author"
                }
            ]
            res.status(400).send(errorMessage);
        }

        if (req.body.availableResolutions.length === 0) {
            let errorMessage = [
                {
                    "message": "не указана резолючия",
                    "field": "availableResolutions"
                }
            ]
            res.status(400).send(errorMessage);
        }

        if (typeof req.body.canBeDownloaded !== "boolean") {
            let errorMessage = [
                {
                    "message": "необходимоу указать булево значение",
                    "field": "canBeDownloaded"
                }
            ]
            res.status(400).send(errorMessage);
        }

        if (req.body.minAgeRestriction < 1 || req.body.minAgeRestriction > 18) {
            let errorMessage = [
                {
                    "message": "не корректно указан возраст",
                    "field": "minAgeRestriction"
                }
            ]
            res.status(400).send(errorMessage);
        }

        if (req.body.publicationDate) {
            const validDate = / /.test(req.body.publicationDate);

            let errorMessage = [
                {
                    "message": "не корректно указана дата",
                    "field": "publicationDate"
                }
            ]
            res.status(400).send(errorMessage);
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
});


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

type AvailableResolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ]



