import { Request, Response, NextFunction } from 'express'; 

const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Api not found!',
        error: ''
    })
}

export default notFound;