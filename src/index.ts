import express, {Request, Response} from 'express'

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  let message = "Hello back end developer";
  res.send(message);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});