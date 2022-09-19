import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {router} from "./router/router";
import {allDeleteRouter} from "./router/allDeleteRouter";

//create express app
const app = express();

const port = process.env.PORT || 3003;

const parserMiddleware = bodyParser();
app.use(parserMiddleware)


const products = [{title: 'tomato'}, {title: 'milk'}]
const addresses = [{value: 'lenina 10'}, {value: 'komenda 20'}]
const students = [{id: '1', firstName: 'Max'}, {id: '2', firstName: 'Ivan'}]



app.get('/products', (req: Request, res: Response) => {
  res.send(products);
})

app.get('/addresses', (req: Request, res: Response) => {
 res.send(addresses) ;
})

//uri параметры - продолжение строки (меняет роутинг)
// через свойства params можем обратиться к данным после :
// : двоеточие это фишка express
app.get('/students/:id_student', (req: Request, res: Response) => {
    let id_student = req.params.id_student;
    let student = students.find(el => el.id === id_student);

    if (student) {
        res.send(student.firstName);
    } else {
        res.send(404);
    }
})


//query параметры - ?firstName
//http://localhost:3000/students?firstName


// app.get('/hometask_01/api/videos', (req: Request, res: Response) => {
//     res.send(dataBase)
// })


app.use('/hometask_01', router);
app.use('/testing', allDeleteRouter);


//start app
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});