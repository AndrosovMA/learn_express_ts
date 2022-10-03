import express from 'express'
import bodyParser from "body-parser";
import {testing} from "./router/testing";
import {videos} from "./router/videos";
import {blogs} from "./router/blogs";

const app = express();

const port = process.env.PORT || 3003;

const parserMiddleware = bodyParser();
app.use(parserMiddleware)


//Testing
app.use('/testing', testing);

//Videos
app.use('/videos', videos)

//Blogs
app.use('/blogs', blogs)


//Posts





//start app
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
