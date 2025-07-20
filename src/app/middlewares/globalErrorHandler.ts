import { ErrorRequestHandler } from "express";

type TErrorSources = {
    path: string;
    message: string;
}[]
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
     
    let statusCode = error.status ? error.status : 500;
    let message = error.message ? error.message : 'Something went wrong!';
    let errorSources: TErrorSources = [
        {
            path: '',
            message: 'Something went wrong!'
        }
    ]


    res.status(statusCode).json({
        success: false,
        message,
        errorMessages: errorSources, 
        error,
    })
}

export default globalErrorHandler;
