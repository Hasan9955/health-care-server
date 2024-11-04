import express, { Application, Request, Response } from 'express';
import cors from 'cors'; 
import { mainRoutes } from './app/routes';


const app: Application = express();


// parser
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())


app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'PH Health Care server is running successfully!'
    })
})


app.use('/api/v1', mainRoutes)



export default app;