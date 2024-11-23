import { Request } from "express";
import { fileUploader } from "../../utility/fileUploader";
import { prisma } from "../../utility/prisma";



const insertIntoDB = async (req: Request) => {
    const file = req.file  
    const payload = req.body
     


    if(file) {
        const uploadFile = await fileUploader.uploadToCloudinary(file);
        payload.icon = uploadFile?.url
    }
 

    const result = await prisma.specialties.create({
        data: payload
    })

    return result;

}


const getAllSpecialties = async () => {


    const result = await prisma.specialties.findMany()

    return  result
}

const deleteSpecialties = async (id: string) => {
    const result = await prisma.specialties.delete({
        where: {
            id: id
        }
    })

    return result
}

export const specialtyServices = {
    insertIntoDB,
    getAllSpecialties,
    deleteSpecialties
}