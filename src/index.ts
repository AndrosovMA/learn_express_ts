import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {testing} from "./router/testing";
import {dataBase} from "./data";
import {videos} from "./router/videos";

const app = express();

const port = process.env.PORT || 3003;

const parserMiddleware = bodyParser();
app.use(parserMiddleware)


//Videos
app.use('/testing', testing);

app.use('/videos', videos)








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




