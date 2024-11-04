import { Request, Response } from "express";
import { userServices } from "./user.service";



const createAdmin = async (req: Request, res: Response) => {
    
    try {
        const result = await userServices.createAdmin(req.body);

    res.status(200).json({
        success: true,
        status: 200,
        message: 'Admin created successfully!',
        data: result
    })
    } catch (error: any) { 
        res.status(500).json({
            success: false,
            status: 500,
            message: error.name || 'Something went wrong',
            error: error
        })
    }
}

export const userControllers = {
    createAdmin
}