import { Admin, UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';
import { prisma } from "../../utility/prisma";
import { Request } from "express";
import { fileUploader } from "../../utility/fileUploader";



const createAdmin = async (req: Request) => {

    const file = req.file;
    const payload = req.body; 

    if (file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);

        payload.admin.profilePhoto = uploadFile?.url

    }
    

    const hashedPassword: string = await bcrypt.hash(payload.password, 10)

    const userData = {
        email: payload.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createdUserData = await transactionClient.user.create({
            data: userData
        })

        const createdAdminData = await transactionClient.admin.create({
            data: payload.admin
        })

        return {
            createdUserData,
            createdAdminData
        }

    })


    return result
}



export const userServices = {
    createAdmin
}