import express from 'express'
import bodyParser from "body-parser";
import {testing} from "./routers/testing";
import {videos} from "./routers/videos";
import {blogs} from "./routers/blogs";
import {posts} from "./routers/posts";
import {runDb} from "./repositories/db";

const app = express();

const port = process.env.PORT || 3003;

const parserMiddleware = bodyParser();
app.use(parserMiddleware)


//Routs
app.use('/testing', testing);
app.use('/videos', videos);
app.use('/blogs', blogs);
app.use('/posts', posts);


//start app
const startApp = async () => {
    await runDb(); //запуск базы данных

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}
startApp();


