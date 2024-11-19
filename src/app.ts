import express, { Application, Request, Response } from 'express';
import cors from 'cors'; 
import { mainRoutes } from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();


// parser
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors())


app.use('/api/v1', mainRoutes)
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'PH Health Care server is running successfully!'
    })
})

app.use(globalErrorHandler);
app.use(notFound)





export default app;