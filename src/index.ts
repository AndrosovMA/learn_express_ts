import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {allDeleteRouter} from "./router/allDeleteRouter";
import {dataBase} from "./data";

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
    nowDate.setDate(nowDate.getDate() + 1)

    const newVideo = {
        "id": +new Date(),
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": nowDate.toISOString(),
        "publicationDate": nowDate.toISOString(),
        "availableResolutions": [
            "P144"
        ]
    }

    dataBase.push(newVideo);

    res.status(201).send(newVideo);
});

app.put('/videos/:id', (req: Request, res: Response) => {
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



